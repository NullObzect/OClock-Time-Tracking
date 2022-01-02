module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('employee_leaves', {
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
      start: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      end: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      reason: {
        allowNull: false,
        type: Sequelize.STRING,
      },

    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('employee_leaves');
  },
};
