module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('leave_type', [

      {
        name: 'casual',
      },
      {
        name: 'sick',
      },
      {
        name: 'study',
      },
      {
        name: 'unpaid',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('leave_type', null, {});
  },
};
