const env = require("../config/env.config");

const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");
const TaskTeam = require("../models/TaskTeam");
const Label = require("../models/Label");
const Checklist = require("../models/Checklist");
const Attachment = require("../models/Attachment");
const Comment = require("../models/Comment");

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

module.exports = {
    getUserTasks,
    getProjectTasks
}