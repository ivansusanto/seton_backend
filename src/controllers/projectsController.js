const env = require("../config/env.config");
const moment = require('moment');

const Project = require("../models/Project");
const ProjectMember = require("../models/ProjectMember");
const User = require("../models/User");
const Task = require("../models/Task");
const TaskTeam = require("../models/TaskTeam");

const createProject = async (req, res) => {
    const { name, description, startTime, deadline, pm_email, members_email} = req.body;

    if (!name || !description || !startTime || !deadline || !pm_email) {
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

    if (new Date(startTime) > new Date(deadline)) {
        return res.status(200).json({
            status : "400",
            message: `Start date must be before deadline!`,
            data: ""
        });
    }

    if(new Date(startTime) < new Date()) {
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
            start: startTime,
            deadline: deadline,
            pm_email: pm_email,
        });

        const project = await Project.findOne({
            order: [ [ 'id', 'DESC' ]],
        });
        for (let i = 0; i < members_email.length; i++){
            let project_member = new ProjectMember({
                project_id: project.id,
                member_email: members_email[i],
            })

            await project_member.save();
        }

        return res.status(201).json({
            status : "201",
            message: `Project successfully created!`,
            data: project.id
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    
    }
}

const getUserProjects = async (req, res) => {
    const { email } = req.params;
    const result = [];
    var projects = await Project.findAll({
        where: {
            pm_email: email
        }
    });
    for (p of projects) result.push(p.dataValues);

    var _projects = await ProjectMember.findAll({
        where: {
            member_email: email
        }
    });
    for (p of _projects) {
        const _p = await Project.findByPk(p.project_id);
        result.push(_p.dataValues);
    }
    for (p of result) {
        p.owner = await User.findByPk(p.pm_email);
        p.pm_email = undefined;
        const members = [];
        const _members = await ProjectMember.findAll({
            where: {
                project_id: p.id
            }
        });
        for (m of _members) {
            members.push(await User.findByPk(m.member_email));
        }
        p.members = members;
        p.tasks = await Task.findAll({
            where: {
                project_id: p.id
            }
        });
    }
    return res.status(200).json({
        status : "200",
        message: `Success get user projects!`,
        data: result
    });
}

const fetchAllProjects = async (req, res) => {
    var projects = await Project.findAll();
    return res.status(200).json(projects);
}

const fetchProjectById = async (req, res) => {
    const { id } = req.params;
    var project = await Project.findByPk(id);
    if(project == null) {
        let projectKosong = {
            id: -1,
            name: "",
            description: "",
            start: "",
            deadline: "",
            pm_email: "",
            status : -1
        }
        return res.status(200).json({
            status : "404",
            message: `Project not found!`,
            data: projectKosong
        });
    } else {
        return res.status(200).json({
            status : "200",
            message: `Success get project by id!`,
            data: project
        });
    }
}

const fetchDetailProjects = async (req, res) => {
    const { id } = req.params;

    var project = await Project.findByPk(id);

    if(project == null) {
        let projectKosong = {
            name: "",
            description: "",
            start: "",
            deadline: "",
            pm_email: "",
            status : -1
        }
        return res.status(200).json({
            status : "404",
            message: `Project not found!`,
            data: projectKosong
        });
    } else {   
        var pm = await User.findByPk(project.pm_email);

        var member = [];
        var members = await ProjectMember.findAll({
            where: {
                project_id: id
            }
        });
        for (m of members) {
            member.push(await User.findByPk(m.member_email));
        }

        var tasks = await Task.findAll({
            where: {
                project_id: id
            }
        });

        for (t in tasks) {
            tasks[t].pic_email = await User.findByPk(tasks[t].pic_email);
        }

        var upcomingTask = 0;
        var ongoingTask = 0;
        var submittedTask = 0;
        var revisionTask = 0;
        var completedTask = 0;

        for (t of tasks) {
            if (t.status == 0) {
                upcomingTask++;
            } else if (t.status == 1) {
                ongoingTask++;
            } else if (t.status == 2) {
                submittedTask++;
            } else if (t.status == 3) {
                revisionTask++;
            } else if (t.status == 4) {
                completedTask++;
            }
        }

        return res.status(200).json({
            status : "200",
            message: `Success get project by id!`,
            data : {
                projectName : project.name,
                projectDescription : project.description,
                projectStart : moment(project.start).format('DD-MM-YYYY HH:mm'),
                projectDeadline : moment(project.deadline).format('DD-MM-YYYY HH:mm'),
                projectManager : pm,
                projectMembers : member,
                upcomingTask : upcomingTask,
                ongoingTask : ongoingTask,
                submittedTask : submittedTask,
                revisionTask : revisionTask,
                completedTask : completedTask,
                projectStatus : project.status == "0"? "Ongoing" : "Completed",
            }

        });
    }
}

module.exports = {
    fetchAllProjects,
    getUserProjects,
    createProject,
    fetchProjectById,
    fetchDetailProjects,
}