module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      user_phone: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      user_role: {
        type: Sequelize.STRING,
        defaultValue: 'user',
      },
      user_mail: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      user_pass: {

        type: Sequelize.STRING,
        defaultValue: null,
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: 'demo-avatar.png',
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: '2',
      },
      create_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      update_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('users');
  },
};
