module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('options', [
      {
        option_title: 'off-day',
        option_value: '4',
      },
      {
        option_title: 'fixed time',
        option_value: '08:00:00',
      },
      {
        option_title: 'int-time',
        option_value: '10:00',
      },
      {
        option_title: 'out-time',
        option_value: '18:00',
      },

    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('options', null, {});
  },
};
