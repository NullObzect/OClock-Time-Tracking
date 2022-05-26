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
      type_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      create_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },

    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('employee_leaves');
  },
};
