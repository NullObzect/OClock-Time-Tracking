module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notice', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      notice_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sender_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      notice_details: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      create_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notice');
  },
};
