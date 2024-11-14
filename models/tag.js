module.exports = (sequelize, DataTypes) => {
  const tag = sequelize.define("tag", {
    name: DataTypes.STRING,
    photoId: {
      type: DataTypes.INTEGER,
      references: { model: "photos", key: "id" },
    },
  });

  return tag;
};
