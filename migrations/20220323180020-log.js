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
        allowNull: false,
        type: Sequelize.STRING(10),
      },
      out_time: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },
      work_hour: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },

      start: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      end: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      work_time: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },
      day_type: {
        allowNull: false,
        type: Sequelize.STRING(30),
      },

      create_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('log');
  },
};
