const express = require("express");
const router = express.Router();

const {
    getUserTasks,
    createTask,
    getProjectMember,
    getTasksById
} = require("../controllers/tasksController");
const { AuthMiddleware } = require("../middlewares/AuthMiddleware");
const MulterUpload = require("../validations/Multer");

router.get("/user/:email", getUserTasks);
router.post("", createTask);
router.get("/project/getMembers/:project_id", getProjectMember);
router.get("/:id", getTasksById);

module.exports = router;