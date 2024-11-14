const { photo } = require("../models");

const saveImages = async (req, res) => {
  try {
    const { imageUrl, description, altDescription, tags, userId } = req.body;

    if (!imageUrl.startsWith("<https://images.unsplash.com/")) {
      return res.status(400).json({ message: "Invalid image URL" });
    }

    if (tags.length > 5) {
      return res.status(400).json({ message: "Cannot have more than 5 tags" });
    }

    for (let tag of tags) {
      if (tag.length > 20) {
        return res
          .status(400)
          .json({ message: "Each tag cannot exceed 20 characters." });
      }
    }

    const savedImage = await photo.create({
      imageUrl,
      description,
      altDescription,
      tags,
      userId,
    });

    res.status(201).json({ message: "Photo saved successfully", savedImage });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to save the Images.", details: error.message });
  }
};

module.exports = { saveImages };
