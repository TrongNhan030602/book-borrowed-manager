const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Đăng nhập
router.post("/login", authController.login);

// Đăng xuất
router.post("/logout", authController.logout);

// Đăng ký
router.post("/register", authController.register);

// Check admin routes
router.get("/checkadmin", authController.checkAdmin);

module.exports = router;
