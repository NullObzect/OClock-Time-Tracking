module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('log', {
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
      in_time: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      out_time: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      work_hour: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },
      start: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
      end: {

        type: Sequelize.DATE,
        defaultValue: null,
      },
      work_time: {

        type: Sequelize.STRING(10),
        defaultValue: null,
      },
      day_type: {
        allowNull: false,
        type: Sequelize.STRING(30),
      },

      create_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('log');
  },
};
