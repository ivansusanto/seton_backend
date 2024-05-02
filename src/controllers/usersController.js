const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require("../config/env.config");
const nodemailer = require('nodemailer');

const User = require("../models/User");

const registerUser = async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({
            message: `Input must not be empty!`
        });
    }

    const user = await User.findByPk(email);
    if (user) {
        return res.status(400).json({
            message: `Email is already used!`
        });
    }

    try {
        const token = jwt.sign({ email: email }, env("SECRET_KEY"), { expiresIn: "30d" });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: env("EMAIL_ADDRESS"),
                pass: env("EMAIL_PASSWORD")
            }
        });
        
        const mailOptions = {
            from: env("EMAIL_ADDRESS"),
            to: email,
            subject: 'Verify your Seton registration account',
            text: `Click link below to verify your account ${ env("HOST") }/api/users/verify?token=${ token }`
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        const bcryptedPassword = await bcrypt.hash(password, parseInt(env("BCRYPT_SALT")));
        await User.create({
            email: email,
            name: name,
            password: bcryptedPassword
        });

        return res.status(201).json({
            message: `User successfully registered!`
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

const verifyUser = async (req, res) => {
    const { token } = req.query;

    try {
        const decodedToken = jwt.verify(token, env("SECRET_KEY"));

        const user = await User.findByPk(decodedToken.email);

        if (user) {
            if (user.status == 1) {
                return res.status(200).json({
                    message: `User is already verified!`
                });
            }
        } else {
            return res.status(404).json({
                message: `Token has been changed by user, email not found!`
            });
        }

        await User.update({
            email: decodedToken.email,
            status: 1
        }, {
            where: {
                email: user.email
            }
        });

        return res.status(201).json({
            message: `User successfully verfied!`
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}
 
const loginUser = async (req, res) => {
    const { email, password, auth_token } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: `Input must not be empty!`
        });
    }

    if (auth_token) {
        const user = await User.findOne({ auth_token: auth_token });
        if (user) {
            return res.status(200).json({
                auth_token: auth_token
            });
        } else {
            return res.status(401).json({
                message: `User unauthorized!`
            });
        }
    }

    const user = await User.findByPk(email);
    if (!user) {
        return res.status(404).json({
            message: `Email have not been registered!`
        });
    }

    try {
        const resultPassword = bcrypt.compareSync(password, user.password);
        if (!resultPassword) {
            return res.status(400).json({
                message: `Incorrect password!`
            });
        } else if (user.status == 0) {
            return res.status(400).json({
                message: `User has not verified their email!`
            });
        }
        const token = jwt.sign({
            ...user.dataValues,
            profile_picture: user.profile_picture ? env("HOST") + user.profile_picture : null,
            password: undefined,
            auth_token: undefined
        }, env("SECRET_KEY"), { expiresIn: "30d" });

        await User.update({
            email: email
        }, {
            where: {
                auth_token: token
            }
        });

        return res.status(200).json({
            auth_token: token
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

const fetchAllUser = async (req, res) => {
    var user = await User.findAll();
    return res.status(200).json(user);
}

module.exports = {
    registerUser,
    verifyUser,
    loginUser,
    fetchAllUser
}