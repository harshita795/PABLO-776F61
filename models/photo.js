module.exports = (sequelize, DataTypes) => {
  const photo = sequelize.define("photo", {
    imageUrl: DataTypes.STRING,
    description: DataTypes.STRING,
    altDescription: DataTypes.STRING,
    dateSaved: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    tags: {
      type: DataTypes.JSONB,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },
  });

  return photo;
};
