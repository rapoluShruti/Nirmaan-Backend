
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");

// CHANGE: Use 'protect' instead of 'auth' to match your middleware file's exports
const { protect } = require("../middleware/auth.middleware");

// Auth endpoints
router.post("/register", register);
router.post("/login", login);

// Example of a protected route using the middleware
// router.get("/me", protect, getMe); 

module.exports = router;
