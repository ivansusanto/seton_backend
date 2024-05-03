const express = require("express");
const router = express.Router();
const { AuthMiddleware } = require("../middlewares/AuthMiddleware");
const MulterUpload = require("../validations/Multer");

const {
    fetchAllProjects,
    createProject,
} = require("../controllers/projectsController");

router.get("", fetchAllProjects)
router.post("/create", createProject)

module.exports = router;