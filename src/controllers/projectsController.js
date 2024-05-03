const env = require("../config/env.config");

const Project = require("../models/Project");
const User = require("../models/User");

const createProject = async (req, res) => {
    const { name, description, start, deadline, pm_email, } = req.body;

    if (!name || !description || !start || !deadline || !pm_email) {
        return res.status(200).json({
            status : "400",
            message: `Input must not be empty!`,
            data: ""
        });
    }

    const user = await User.findByPk(pm_email);
    if (!user) {
        return res.status(200).json({
            status : "404",
            message: `Project Manager email have not been registered!`,
            data: ""
        });
    }

    //regex for start and deadline (yyyy-MM-dd HH:mm)
    const date_regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!date_regex.test(start) || !date_regex.test(deadline)) {
        return res.status(200).json({
            status : "400",
            message: `Invalid date format!`,
            data: ""
        });
    }

    if (new Date(start) > new Date(deadline)) {
        return res.status(200).json({
            status : "400",
            message: `Start date must be before deadline!`,
            data: ""
        });
    }

    if(new Date(start) < new Date()) {
        return res.status(200).json({
            status : "400",
            message: `Start date must be after today!`,
            data: ""
        });
    }

    try {
        await Project.create({
            name: name,
            description: description,
            start: start,
            deadline: deadline,
            pm_email: pm_email,
        });

        return res.status(201).json({
            status : "201",
            message: `Project successfully created!`,
            data: ""
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    
    }
}

const fetchAllProjects = async (req, res) => {
    var project = await Project.findAll();
    return res.status(200).json(project);
}

module.exports = {
    fetchAllProjects,
    createProject,
}