module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define("user", {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
  });

  return user;
};
