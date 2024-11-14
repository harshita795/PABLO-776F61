const { photo } = require("../models");

const saveImages = async (req, res) => {
  try {
    const { imageUrl, description, altDescription, tags, userId } = req.body;

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
