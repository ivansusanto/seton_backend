const express = require("express");
const router = express.Router();

const {
    registerUser,
    registerUserWithGoogle,
    verifyUser,
    loginUser,
    loginUserWithGoogle,
    fetchAllUser,
    fetchAllUserExceptUserLogin,
    emailValidate,
} = require("../controllers/usersController");
const { AuthMiddleware } = require("../middlewares/AuthMiddleware");
const MulterUpload = require("../validations/Multer");

router.post("/register", registerUser);
router.post("/registerWithGoogle", registerUserWithGoogle);
router.get("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/loginWithGoogle/:email", loginUserWithGoogle);
router.get("/", fetchAllUser);
router.get("/except/:email", fetchAllUserExceptUserLogin);
router.get("/:email", emailValidate);

module.exports = router;