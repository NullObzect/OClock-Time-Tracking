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
        option_title: 'in-time',
        option_value: '10:00',
      },
      {
        option_title: 'out-time',
        option_value: '18:00',
      },
      {
        option_title: 'tolerance-time',
        option_value: '00:30',
      },
      {
        option_title: 'leave-limit',
        option_value: '52',
      },
      {
        option_title: 'weekly-leave-day',
        option_value: '1',
      },

    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('options', null, {});
  },
};
