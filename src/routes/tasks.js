const express = require("express");
const router = express.Router();

const {
    getUserTasks,
    getProjectTasks
} = require("../controllers/tasksController");
const { AuthMiddleware } = require("../middlewares/AuthMiddleware");
const MulterUpload = require("../validations/Multer");

router.get("/user/:email", getUserTasks);
router.get("/project/:project_id", getProjectTasks);

module.exports = router;