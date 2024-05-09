const express = require("express");
const router = express.Router();
const { AuthMiddleware } = require("../middlewares/AuthMiddleware");
const MulterUpload = require("../validations/Multer");

const {
    fetchAllProjects,
    getUserProjects,
    createProject,
} = require("../controllers/projectsController");

router.get("/", fetchAllProjects);
router.get("/:email", getUserProjects);
router.post("/", createProject);

module.exports = router;