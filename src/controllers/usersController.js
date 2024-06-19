const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require("../config/env.config");
const nodemailer = require('nodemailer');
const { Op } = require("sequelize");

const User = require("../models/User");

const registerUser = async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(200).json({
            status : "400",
            message: `Input must not be empty!`,
            data: ""
        });
    }

    const user = await User.findByPk(email);
    if (user) {
        return res.status(200).json({
            status : "400",
            message: `Email is already used!`,
            data: ""
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
            status : "201",
            message: `User successfully registered!`,
            data: ""
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

const registerUserWithGoogle = async (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
        return res.status(200).json({
            status : "400",
            message: `Input must not be empty!`,
            data: ""
        });
    }

    const user = await User.findByPk(email);
    if (user) {
        return res.status(200).json({
            status : "400",
            message: `Email is already used!`,
            data: ""
        });
    }

    try {
        await User.create({
            email: email,
            name: name,
            status: 1 //auto aktif
        });

        return res.status(201).json({
            status : "201",
            message: `User successfully registered!`,
            data: ""
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
                    status : "200",
                    message: `User is already verified!`,
                    data: ""
                });
            }
        } else {
            return res.status(200).json({
                status : "404",
                message: `Token has been changed by user, email not found!`,
                data: ""
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
            status : "201",
            message: `User successfully verfied!`,
            data: ""
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
        return res.status(200).json({
            status : "400",
            message: `Input must not be empty!`,
            data: ""
        });
    }

    if (auth_token) {
        const user = await User.findOne({ auth_token: auth_token });
        if (user) {
            return res.status(200).json({
                auth_token: auth_token
            });
        } else {
            return res.status(200).json({
                status : "401",
                message: `User unauthorized!`,
                data: ""
            });
        }
    }

    const user = await User.findByPk(email);
    if (!user) {
        return res.status(200).json({
            status : "404",
            message: `Email have not been registered!`,
            data: ""
        });
    }

    try {
        const resultPassword = bcrypt.compareSync(password, user.password);
        if (!resultPassword) {
            return res.status(200).json({
                status : "400",
                message: `Incorrect password!`,
                data: ""
            });
        } else if (user.status == 0) {
            return res.status(200).json({
                status : "400",
                message: `User has not verified their email!`,
                data: ""
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
            status : "200",
            message: `User successfully logged in!`,
            data: token
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

const loginUserWithGoogle = async (req, res) => {
    const { email, name } = req.body;
    const user = await User.findByPk(email);
    if (user) {
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
            status : "200",
            message: `User successfully logged in!`,
            data: token
        });
    } else {
        // return res.status(200).json({
        //     status : "404",
        //     message: `Email have not been registered!`,
        //     data: ""
        // });

        try {
            await User.create({
                email: email,
                name: name,
                status: 1 //auto aktif
            });
    
            return res.status(201).json({
                status : "201",
                message: `User successfully registered!`,
                data: ""
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
    }
}

const fetchAllUser = async (req, res) => {
    var user = await User.findAll();
    return res.status(200).json(user);
}

const fetchAllUserExceptUserLogin = async (req, res) => {
    const { email } = req.params;
    const result = [];

    //ambil semua user kecuali yg email
    const users = await User.findAll({
        where: {
            email: {
                [Op.ne]: email
            }
        }
    });
    for (u of users) result.push(u.dataValues);

    return res.status(200).json({
        status : "200",
        message: `Success get all user except user login!`,
        data: result
    });
}

const emailValidate = async (req, res) => {
    const { email } = req.params;

    var user = await User.findOne({
        where: {
            email: email
        }
    });

    if (user) {
        return res.status(200).json({
            status : "200",
            message: `Email Valid`,
            data: user
        });
    } else {
        var userKosong = {
            email: "",
            name: "",
            profile_picture: null,
            password: "",
            auth_token:"",
            status: 0
        }
        return res.status(200).json({
            status : "404",
            message: `Email not found!`,
            data: userKosong
        });
    }
}

const updatePassword = async (req, res) => {
    const { email } = req.params;
    const { oldPassword, newPassowrd } = req.body;

    var user = await User.findOne({
        where: {
            email: email
        }
    });

    const resultPassword = bcrypt.compareSync(oldPassword, user.password);
    if (!resultPassword) {
        return res.status(200).json({
            status : "400",
            message: `Old Password do not match!`,
            data: ""
        });
    } else {
        const bcryptedPassword = await bcrypt.hash(newPassowrd, parseInt(env("BCRYPT_SALT")));
        await User.update({
            email: email,
            password: bcryptedPassword
        }, {
            where: {
                email: email
            }
        });
        return res.status(200).json({
            status : "200",
            message: `Success update password!`,
            data: ""
        });
    }
}

const updateProfile = async (req, res) => {
    // const { email } = req.params;

    // var user = await User.findOne({
    //     where: {
    //         email: email
    //     }
    // });

    // if (user) {
    //     return res.status(200).json({
    //         status : "200",
    //         message: `Email Valid`,
    //         data: user
    //     });
    // } else {
    //     var userKosong = {
    //         email: "",
    //         name: "",
    //         profile_picture: null,
    //         password: "",
    //         auth_token:"",
    //         status: 0
    //     }
    //     return res.status(200).json({
    //         status : "404",
    //         message: `Email not found!`,
    //         data: userKosong
    //     });
    // }
}

module.exports = {
    registerUser,
    registerUserWithGoogle,
    verifyUser,
    loginUser,
    loginUserWithGoogle,
    fetchAllUser,
    fetchAllUserExceptUserLogin,
    emailValidate,
    updatePassword,
    updateProfile
}