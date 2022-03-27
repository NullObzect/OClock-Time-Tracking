module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('attendance', {
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
      project_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      work_details: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },

      start: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      end: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      create_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('attendance');
  },
};
