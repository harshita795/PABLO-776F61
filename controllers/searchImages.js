const axiosInstance = require("../lib/axios.lib");

const searchImages = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "A search term is required." });
    }

    const response = await axiosInstance.get(`/search/photos?query=${query}`);

    const photos = response.data.results.map((photo) => ({
      imageUrl: photo.urls.regular,
      description: photo.description,
      altDescription: photo.alt_description,
    }));

    if (photos.length === 0) {
      return res
        .status(404)
        .json({ message: "No images found for the given query." });
    }

    res.status(200).json({ photos });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch the Images" });
  }
};

module.exports = { searchImages };
