const express = require("express");
const router = express.Router();
const createNewUser = require("../controllers/createNewUser.js");

// Route to create a new user
router.post("/api/users", createNewUser);

module.exports = router;
