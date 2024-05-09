const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
const projectsRouter = require("./projects");
const tasksRouter = require("./tasks");

router.use("/public", express.static("./public"));
router.use("/users", usersRouter);
router.use("/projects", projectsRouter);
router.use("/tasks", tasksRouter);

module.exports = router;