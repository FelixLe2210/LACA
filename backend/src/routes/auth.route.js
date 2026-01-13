const express = require("express");
const router = express.Router();

const { register } = require("../controllers/auth.controller");
router.post("/register", register);

const { verifyOTP } = require("../controllers/auth.controller");
router.post("/verify-otp", verifyOTP);

module.exports = router;
