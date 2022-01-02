module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('holidays', [
      {
        title: '16 Dec victory day',
        start: '2021-12-16',
        end: '2021-12-16',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('holidays', null, {});
  },
};
