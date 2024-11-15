const { photo } = require("../models");

const addTagsByPhotoId = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { tags } = req.body;

    const findPhoto = await photo.findByPk(photoId);
    if (!findPhoto) {
      return res.status(400).json({ message: "Photo not found." });
    }

    const existingTags = findPhoto.tags || [];
    const updatedTags = [...existingTags, ...tags];

    if (updatedTags.length > 5) {
      return res
        .status(400)
        .json({ message: "Each photo can have a maximum of 5 tags" });
    }

    for (let tag of tags) {
      if (tag.trim().length === 0) {
        return res
          .status(400)
          .json({ message: "Tags must be non-empty strings" });
      }
    }

    findPhoto.tags = updatedTags;
    await findPhoto.save();

    res.status(201).json({ message: "Tags added successfully.", updatedTags });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to add the tags to the specific photo.",
      details: error.message,
    });
  }
};

module.exports = { addTagsByPhotoId };
