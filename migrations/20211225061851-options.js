module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('options', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      option_title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      option_value: {
        allowNull: false,
        type: Sequelize.STRING,
      },

    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('options');
  },
};
