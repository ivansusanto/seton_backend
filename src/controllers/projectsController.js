const env = require("../config/env.config");

const Project = require("../models/Project");
const ProjectMember = require("../models/ProjectMember");
const User = require("../models/User");
const Task = require("../models/Task");
const TaskTeam = require("../models/TaskTeam");
const Comment = require("../models/Comment");
const Attachment = require("../models/Attachment");
const Checklist = require("../models/Checklist");
const Label = require("../models/Label");

const createProject = async (req, res) => {
    const { name, description, startTime, deadline, pm_email, members_email} = req.body;
    console.log(req.body)
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
        
        if(members_email.length > 0 && members_email != undefined){
            for (let i = 0; i < members_email.length; i++){
                let project_member = new ProjectMember({
                    project_id: project.id,
                    member_email: members_email[i],
                })
    
                await project_member.save();
            }
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
            },
            order: [
                ['status', 'ASC'],
                ['title', 'ASC']
            ]
        });

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
                projectStart : project.start,
                projectDeadline : project.deadline,
                projectManager : pm,
                projectMembers : member,
                projectTasks : tasks, 
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

const addNewMember = async (req, res) =>{
    const { id, email } = req.params;

    if (!id || !email) {
        return res.status(200).json({
            status : "400",
            message: `Input must not be empty!`,
            data: ""
        });
    } 

    const project = await Project.findByPk(id);
    if (!project) {
        return res.status(200).json({
            status : "404",
            message: `Project not found!`,
            data: ""
        });
    }

    const user = await User.findByPk(email);
    if (!user) {
        return res.status(200).json({
            status : "404",
            message: `User not found!`,
            data: ""
        });
    }

    try {
        await ProjectMember.create({
            project_id: id,
            member_email: email
        });

        return res.status(201).json({
            status : "201",
            message: `Member successfully added!`,
            data: ""
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }

}

const deleteMember = async (req, res) => {
    const { id, email } = req.params;

    if (!id || !email) {
        return res.status(200).json({
            status : "400",
            message: `Input must not be empty!`,
            data: ""
        });
    } 

    const project = await Project.findByPk(id);
    if (!project) {
        return res.status(200).json({
            status : "404",
            message: `Project not found!`,
            data: ""
        });
    }

    const user = await User.findByPk(email);
    if (!user) {
        return res.status(200).json({
            status : "404",
            message: `User not found!`,
            data: ""
        });
    }

    //cek adakah task yg dikerjakan
    const task = await Task.findAll({
        where: {
            project_id: id,
            pic_email: email
        }
    });

    if (task.length > 0) {
        return res.status(200).json({
            status : "400",
            message: `Member still have task to do!`,
            data: ""
        });
    }

    //task team tpi task yg ada di project id
    const task2 = await Task.findAll({
        where: {
            project_id: id,
        }
    });

    for (t of task2) {
        const task_team = await TaskTeam.findAll({
            where: {
                task_id: t.id,
                team_email: email
            }
        });

        if (task_team.length > 0) {
            return res.status(200).json({
                status : "400",
                message: `Member still have task to do!`,
                data: ""
            });
        }
    }

    try {
        await ProjectMember.destroy({
            where: {
                project_id: id,
                member_email: email
            }
        });

        return res.status(200).json({
            status : "200",
            message: `Member successfully deleted!`,
            data: ""
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

const getTasksProject = async (req, res) => {
    const { id } = req.params;
    const result = [];
    var tasks = await Task.findAll({
        where: {
            project_id : id
        }
    });
    for (t of tasks) result.push(t.dataValues);

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
        t.comments = await Comment.findAll({
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

module.exports = {
    fetchAllProjects,
    getUserProjects,
    createProject,
    fetchProjectById,
    fetchDetailProjects,
    addNewMember,
    deleteMember,
    getTasksProject
}