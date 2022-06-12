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
      create_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      update_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
      },

    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('options');
  },
};
