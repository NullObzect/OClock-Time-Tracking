module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('request_leave', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      type_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      start: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      end: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      status: {

        type: Sequelize.INTEGER,
        defaultValue: '0',
      },
      create_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },

    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('request_leave');
  },
};
