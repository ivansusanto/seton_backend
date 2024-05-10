const express = require("express");
const router = express.Router();

const {
    getUserTasks,
    getProjectTasks,
    createTask,
    getProjectMember
} = require("../controllers/tasksController");
const { AuthMiddleware } = require("../middlewares/AuthMiddleware");
const MulterUpload = require("../validations/Multer");

router.get("/user/:email", getUserTasks);
router.get("/project/:project_id", getProjectTasks);
router.post("", createTask);
router.get("/project/getMembers/:project_id", getProjectMember);

module.exports = router;