module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("searchHistories", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      query: { type: Sequelize.STRING, allowNull: false },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("searchHistories");
  },
};
