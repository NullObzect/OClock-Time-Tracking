module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('projects', [
      {
        project_name: 'Oclock',
        project_details: 'working for report page',
      },
      {
        project_name: 'Others',
        project_details: 'Others working details',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('projects', null, {});
  },
};
