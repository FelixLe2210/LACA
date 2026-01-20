const express = require("express");
const router = express.Router();

const { register } = require("../controllers/auth.controller");
router.post("/register", register);

const { verifyOTP } = require("../controllers/auth.controller");
router.post("/verify-otp", verifyOTP);

const { login } = require("../controllers/auth.controller");
router.post("/login", login);

const { forgotPassword } = require("../controllers/auth.controller");
router.post("/forgot-password", forgotPassword);

const { resetPassword } = require("../controllers/auth.controller");
router.post("/reset-password", resetPassword);

const { logout } = require("../controllers/auth.controller");
router.post("/logout", logout);
module.exports = router;
