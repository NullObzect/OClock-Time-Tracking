module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      token_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      token_link: {
        allowNull: false,
        type: Sequelize.STRING,
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tokens');
  },
};
