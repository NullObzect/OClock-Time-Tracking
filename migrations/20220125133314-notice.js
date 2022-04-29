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
        type: Sequelize.STRING,
        defaultValue: null,
      },
      sender_id: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      user_id: {
        type: Sequelize.STRING,
        defaultValue: null,
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
