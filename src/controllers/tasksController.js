const color = require('../config/color');
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

const { MulterUpload, uploadHandler} = require("../validations/Multer");

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

const getTasksById = async (req, res) => {
    const {id} = req.params;
    var task = await Task.findByPk(id);
    task.pic = await User.findByPk(task.pic_email);
    task.project = await Project.findByPk(task.project_id);
    var teams= await TaskTeam.findAll({
        where: {
            task_id: id
        }
    })
    var member = [];
    for (m of teams) {
        member.push(await User.findByPk(m.team_email))
    }
    
    var comments= await Comment.findAll({
        where: {
            task_id: id
        }
    })
    
    var attachments= await Attachment.findAll({
        where: {
            task_id: id
        }
    })

    var checklists= await Checklist.findAll({
        where: {
            task_id: id
        }
    })

    var labels= await Label.findAll({
        where: {
            task_id: id
        }
    })

    return res.status(200).json({
        status : "200",
        message: `Success get task by id!`,
        data: {
            id : task.id,
            title : task.title,
            deadline : task.deadline,
            description : task.description,
            priority : task.priority,
            statusTask : task.status,
            pic : task.pic,
            project : task.project,
            teams : member,
            comments : comments,
            attachments : attachments,
            checklists : checklists,
            labels : labels
        }
    });
}

const updateStatusTask = async (req, res) => {
    const {id, status} = req.params
    console.log(`update status task ${id} to ${status}`);
    if(!status) {
        return res.status(200).json({
            status : "400",
            message: `Input must not be empty!`,
            data: ""
        });
    }
    var task = await Task.findByPk(id);
    task.status = status;
    await task.save();
    return res.status(200).json({
        status : "200",
        message: `Success update task status!`,
        data: ""
    });
}

const addLabel = async (req, res) => {
    const {id, title} = req.params;

    let warna = color[Math.floor(Math.random() * color.length)];
    

    var label = new Label({
        task_id: id,
        title: title,
        color: warna
    });
    await label.save();

    var data = await Label.findByPk(label.id);
    return res.status(200).json({
        status : "201",
        message: `Success add label!`,
        data: data
    });
}

const addChecklist = async (req, res) => {
    const {id, title} = req.params;

    var checklist = new Checklist({
        task_id: id,
        title: title,
        is_checked: 0
    });
    await checklist.save();

    var data = await Checklist.findByPk(checklist.id);
    return res.status(200).json({
        status : "201",
        message: `Success add checklist!`,
        data: data
    });
}

const uploadAttachment = async (req, res) => {
    try{
        MulterUpload.any()(req, res, async (err) => {
            uploadHandler(req, req.files);

            const { filename } = req.body;
            const { task_id } = req.params;
        
            if (!task_id || !filename) {
                return res.status(400).json({
                    status: "400",
                    message:  `Input must not be empty!`,
                    data: ""
                });
            }

            const date = new Date()
        
            try {
                const attachment = await Attachment.create({
                    task_id: task_id,
                    file_name: filename,
                    upload_time: date
                });
        
                return res.status(201).json({
                    status: "201",
                    message: `Attachment successfully created!`,
                    data: attachment
                });
            
            } catch(err) {
                return res.status(200).json({
                    status: "400",
                    message: err.message,
                    data: ""
                });
            }
        })

    }catch (err) {
        return res.status(200).json({
            status: "500",
            message: err.message,
            data: ""
        });
    }

}

const getAttachment = async (req, res) => {
    const { task_id } = req.params;
    const result = [];

    var attachments = await Attachment.findAll({
        where: {
            task_id: task_id
        }
    });

    for (a of attachments) {
        result.push(a.dataValues);
    }

    return res.status(200).json({
        status : "200",
        message: `Success get attachments!`,
        data: result
    });
}

const getChecklists = async (req, res) => {
    const { id } = req.params;
    const result = [];

    var checklists = await Checklist.findAll({
        where: {
            task_id: id
        }
    });

    for (c of checklists) {
        result.push(c.dataValues);
    }

    return res.status(200).json({
        status : "200",
        message: `Success get checklists!`,
        data: result
    });
}

const removeChecklists = async (req, res) => {
    const { id } = req.params;
    var checklist = await Checklist.findByPk(id);
    await checklist.destroy();

    return res.status(200).json({
        status : "200",
        message: `Success remove checklist!`,
        data: ""
    });
}

const getComment = async (req, res) => {
    const { id } = req.params;
    const result = [];

    var comments = await Comment.findAll({
        where: {
            task_id: id
        },
        order: [
            ['time', 'DESC']
        ]
    });

    for (c of comments) {
        var user = await User.findByPk(c.user_email);
        c.user_email = user;
    }

    return res.status(200).json({
        status : "200",
        message: `Success get comments!`,
        data: comments
    });
}

const addComment = async (req, res) => {
    const { task_id, email, value } = req.body;

    const date = new Date()
    //check email
    const user = await User.findByPk(email);
    if(!user) {
        return res.status(200).json({
            status: "400",
            message: `User not found!`,
            data: ""
        });
    }

    try {
        const _comment = await Comment.create({
            task_id: task_id,
            user_email: email,
            value: value,
            time: date
        });

        return res.status(200).json({
            status: "201",
            message: `Comment successfully created!`,
            data: _comment
        });
    
    } catch(err) {
        return res.status(200).json({
            status: "400",
            message: err.message,
            data: {
                id : -1,
                task_id: task_id,
                user_email: email,
                value: value,
                time: date
            }
        });
    }

}

const changeStatusChecklist = async (req, res) => {
    const { id } = req.params;
    var checklist = await Checklist.findByPk(id);
    checklist.is_checked = !checklist.is_checked;
    await checklist.save();

    return res.status(200).json({
        status : "200",
        message: `Success change checklist status!`,
        data: ""
    });
}

module.exports = {
    getUserTasks,
    createTask,
    getProjectMember,
    getTasksById,
    updateStatusTask,
    addLabel,
    addChecklist,
    uploadAttachment,
    getAttachment,
    getChecklists,
    removeChecklists,
    getComment,
    addComment,
    changeStatusChecklist
}