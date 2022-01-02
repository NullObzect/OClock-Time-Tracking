module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users_connection_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      platform: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      user_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      user_avatar: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      create_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      update_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users_connection_details');
  },
};
