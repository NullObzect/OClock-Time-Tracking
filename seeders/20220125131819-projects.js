module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('projects', [
      {
        id: 0,
        project_name: 'Office',
        project_details: 'Office work',
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
