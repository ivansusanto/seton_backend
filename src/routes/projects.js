const express = require("express");
const router = express.Router();
const { AuthMiddleware } = require("../middlewares/AuthMiddleware");
const MulterUpload = require("../validations/Multer");

const {
    fetchAllProjects,
    getUserProjects,
    createProject,
    fetchProjectById,
    fetchDetailProjects,
    addNewMember,
    deleteMember
} = require("../controllers/projectsController");

router.get("/", fetchAllProjects);
router.get("/:email", getUserProjects);
router.post("/", createProject);
router.get("/getById/:id", fetchProjectById);
router.get("/getDetail/:id", fetchDetailProjects);
router.post("/addMember/:id/:email", addNewMember);
router.delete("/deleteMember/:id/:email", deleteMember);

module.exports = router;