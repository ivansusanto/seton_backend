const express = require("express");
const router = express.Router();

const {
    registerUser,
    verifyUser,
    loginUser,
    fetchAllUser
} = require("../controllers/usersController");
const { AuthMiddleware } = require("../middlewares/AuthMiddleware");
const MulterUpload = require("../validations/Multer");

router.post("/register", registerUser);
router.get("/verify", verifyUser);
router.post("/login", loginUser);
router.get("/", fetchAllUser);

module.exports = router;