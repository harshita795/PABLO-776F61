const { searchHistory, photo, Sequelize } = require("../models");

const searchPhotosByTag = async (req, res) => {
  try {
    const { tags, sort, userId } = req.query;

    // validation for non-empty tag
    if (tags.trim() === "") {
      return res
        .status(400)
        .json({ error: "A valid, non-empty tag must be provided." });
    }

    // validating sort query
    let sortOrder = "ASC";

    if (sort) {
      let sortUpperCase = sort.toUpperCase();
      if (sortUpperCase === "ASC" || sortUpperCase === "DESC") {
        sortOrder = sortUpperCase;
      } else {
        return res
          .status(400)
          .json({ error: "Invalid sort order. Use 'ASC' or 'DESC'." });
      }
    }

    // saving the searched tag with userId to search history
    if (userId) {
      await searchHistory.create({
        userId: userId,
        query: tags,
      });
    }

    // checking searched tag exist in database or not.
    const tagExists = await photo.findOne({
      where: {
        tags: {
          [Sequelize.Op.contains]: [tags],
        },
      },
    });

    if (!tagExists) {
      return res.status(404).json({ error: "Tag not found." });
    }

    // finding the photos from database by searched tag
    const findPhotos = await photo.findAll({
      where: {
        tags: {
          [Sequelize.Op.contains]: [tags],
        },
      },

      order: [["dateSaved", sortOrder]],
    });

    // formatted which data to show
    const allPhotos = await findPhotos.map((photo) => ({
      imageUrl: photo.imageUrl,
      description: photo.description,
      dateSaved: photo.dateSaved,
      tags: photo.tags,
    }));

    return res.status(201).json({ allPhotos });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { searchPhotosByTag };
