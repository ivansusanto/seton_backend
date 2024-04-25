const express = require("express");
const router = express.Router();

const {
    registerUser,
    verifyUser,
    loginUser
} = require("../controllers/usersController");
const { AuthMiddleware } = require("../middlewares/AuthMiddleware");
const MulterUpload = require("../validations/Multer");

router.post("/register", registerUser);
router.get("/verify", verifyUser);
router.post("/login", loginUser);

module.exports = router;