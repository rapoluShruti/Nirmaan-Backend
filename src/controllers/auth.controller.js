const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const allowedRoles = ["MANAGER", "SITE_ENGINEER", "SUPERVISOR"];
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  companyName: user.companyName,
  orgType: user.orgType,
  gst: user.gst,
  address: user.address,
  phone: user.phone,
});

// REGISTER
exports.register = async (req, res) => {
  try {
    const {
      name, email, password, role, companyName, orgType, gst, address, phone,
    } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }
    if (!allowedRoles.includes(role || "SUPERVISOR")) {
      return res.status(400).json({ message: "Please select a valid account role." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "SUPERVISOR",
      companyName: companyName?.trim() || undefined,
      orgType: orgType || undefined,
      gst: gst?.trim().toUpperCase() || undefined,
      address: address?.trim() || undefined,
      phone: phone?.trim() || undefined,
    });

    return res.status(201).json({
      message: "Account registered successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Unable to register right now. Please try again." });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");
      return res.status(500).json({ message: "Authentication service is not configured." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, user: publicUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Unable to sign in right now. Please try again." });
  }
};
