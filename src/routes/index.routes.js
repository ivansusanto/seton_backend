const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
const projectsRouter = require("./projects");

router.use("/public", express.static("./public"));
router.use("/users", usersRouter);
router.use("/projects", projectsRouter);

module.exports = router;