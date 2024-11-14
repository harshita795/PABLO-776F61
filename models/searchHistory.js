module.exports = (sequelize, DataTypes) => {
  const searchHistory = sequelize.define("searchHistory", {
    query: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return searchHistory;
};
