const { searchHistory } = require("../models");
const displaySearchHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "A valid userId is required." });
    }

    // fetching searc history with given userId
    const fetchSearchHistory = await searchHistory.findAll({
      where: {
        userId,
      },
    });

    // mapping data to display
    const searchHistoryData = await fetchSearchHistory.map((history) => ({
      query: history.query,
      timestamp: history.timestamp,
    }));

    return res.status(200).json({
      searchHistory: searchHistoryData,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { displaySearchHistory };
