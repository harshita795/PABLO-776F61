const express = require("express");
const router = express.Router();
const {
  displaySearchHistory,
} = require("../controllers/displaySearchHistory.js");

// Route for displaying search history
router.get("/api/search-history", displaySearchHistory);

module.exports = router;
