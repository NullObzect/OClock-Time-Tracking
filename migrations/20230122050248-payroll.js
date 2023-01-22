module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payroll', {
      payroll_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },

    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payroll')
  },
};
