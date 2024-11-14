module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tags", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      photoId: {
        type: Sequelize.INTEGER,
        references: { model: "photos", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("tags");
  },
};
