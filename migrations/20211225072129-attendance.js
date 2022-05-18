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

        type: Sequelize.STRING,
        defaultValue: null,
      },
      out_time: {

        type: Sequelize.STRING,
        defaultValue: null,
      },
      project_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      work_details: {
        allowNull: false,
        type: Sequelize.STRING(1000),
      },
      start: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      end: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
      create_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('attendance');
  },
};
