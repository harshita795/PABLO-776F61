module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("photos", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      imageUrl: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.STRING },
      altDescription: { type: Sequelize.STRING },
      dateSaved: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      tags: {
        type: Sequelize.JSONB,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("photos");
  },
};
