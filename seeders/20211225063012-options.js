module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('options', [
      {
        option_title: 'off-day',
        option_value: 'friday',
      },
      {
        option_title: 'fixed time',
        option_value: '08:00:00',
      },

    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('options', null, {});
  },
};
