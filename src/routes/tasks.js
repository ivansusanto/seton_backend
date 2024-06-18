const express = require("express");
const router = express.Router();

const {
    getUserTasks,
    createTask,
    getProjectMember,
    getTasksById,
    updateStatusTask,
    addLabel,
    addChecklist,
    uploadAttachment,
    getAttachment
} = require("../controllers/tasksController");
const { AuthMiddleware } = require("../middlewares/AuthMiddleware");
const MulterUpload = require("../validations/Multer");

router.post("/attachment", uploadAttachment);
router.get("/attachment/:task_id", getAttachment);
router.get("/user/:email", getUserTasks);
router.post("", createTask);
router.get("/project/getMembers/:project_id", getProjectMember);
router.get("/:id", getTasksById);
router.put("/:id/:status", updateStatusTask);

router.post("/label/:id/:title", addLabel);
router.post("/checklist/:id/:title", addChecklist);

module.exports = router;