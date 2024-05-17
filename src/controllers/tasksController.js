const env = require("../config/env.config");

const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");
const TaskTeam = require("../models/TaskTeam");
const Label = require("../models/Label");
const Checklist = require("../models/Checklist");
const Attachment = require("../models/Attachment");
const Comment = require("../models/Comment");
const ProjectMember = require("../models/ProjectMember");

const getUserTasks = async (req, res) => {
    const { email } = req.params;
    const result = [];
    var tasks = await Task.findAll({
        where: {
            pic_email: email
        }
    });
    for (t of tasks) result.push(t.dataValues);

    var _tasks = await TaskTeam.findAll({
        where: {
            team_email: email
        }
    });
    for (t of _tasks) {
        const _t = await Task.findByPk(t.task_id);
        result.push(_t.dataValues);
    }
    for (t of result) {
        t.pic = await User.findByPk(t.pic_email);
        t.pic_email = undefined;
        t.project = await Project.findByPk(t.project_id);
        t.project_id = undefined;
        const teams = [];
        const _teams = await TaskTeam.findAll({
            where: {
                task_id: t.id
            }
        });
        for (_t of _teams) {
            teams.push(await User.findByPk(_t.team_email));
        }
        t.teams = teams;
        t.comments = await Comment.findAll({
            where: {
                task_id: t.id
            }
        });
        t.attachments = await Attachment.findAll({
            where: {
                task_id: t.id
            }
        });
        t.checklists = await Checklist.findAll({
            where: {
                task_id: t.id
            }
        });
        t.labels = await Label.findAll({
            where: {
                task_id: t.id
            }
        });
    }
    return res.status(200).json({
        status : "200",
        message: `Success get user tasks!`,
        data: result
    });
}

const getProjectTasks = async (req, res) => {
    
}

const createTask = async (req, res) => {
    const {project_id, title, deadline, description, priority, taks_team, pic_email} = req.body;

    if (!project_id || !title || !deadline || !description || !priority || !pic_email) {
        return res.status(400).json({
            status: "400",
            message:  `Input must not be empty!`,
            data: ""
        });
    }

    if(new Date(deadline) < new Date()) {
        return res.status(200).json({
            status : "400",
            message: `deadline must be after today!`,
            data: ""
        });
    }

    var prioritas = -1;
    if(priority == "Low") {
        prioritas = 0;
    } else if(priority == "Medium") {
        prioritas = 1;
    } else if(priority == "High") {
        prioritas = 2;
    }


    try {
        const task = await Task.create({
            project_id: project_id,
            title: title,
            deadline: deadline,
            description: description,
            priority: prioritas,
            status : 0,
            pic_email: pic_email
        });

        for (let i = 0; i < taks_team.length; i++) {
            let task_team = new TaskTeam({
                task_id: task.id,
                team_email: taks_team[i]
            });

            await task_team.save();
        }

        return res.status(201).json({
            status: "201",
            message: `Task successfully created!`,
            data: task.id
        });
    
    } catch(err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

const getProjectMember = async (req, res) => {
    const { project_id } = req.params;
    const result = [];

    var project = await Project.findByPk(project_id);
    var pm = await User.findByPk(project.pm_email);
    result.push(pm.dataValues);

    var members = await ProjectMember.findAll({
        where: {
            project_id: project_id
        }
    });

    for (m of members) {
        result.push(await User.findByPk(m.member_email));
    }

    return res.status(200).json({
        status : "200",
        message: `Success get project members!`,
        data: result
    });
}

module.exports = {
    getUserTasks,
    getProjectTasks,
    createTask,
    getProjectMember,
}