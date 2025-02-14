const express = require("express");
const router = express.Router();
const { searchImages } = require("../controllers/searchImages.js");
const { saveImages } = require("../controllers/saveImages.js");
const { addTagsByPhotoId } = require("../controllers/addTagsByPhotoId.js");
const { searchPhotosByTag } = require("../controllers/searchPhotosByTag.js");

// Route for searching images
router.get("/api/search/photos", searchImages);

// Route for saving images
router.post("/api/photos", saveImages);

// Route for adding tags to a photo
router.post("/api/photos/:photoId/tags", addTagsByPhotoId);

// Route for searching photos by tag
router.get("/api/photos/tag/search", searchPhotosByTag);

module.exports = router;
