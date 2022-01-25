module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('notice', [
      {
        notice_type: '',
        sender_id: '',
        user_id: '',
        notice_details: '',
        create_at: '',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('notice', null, {});
  },
};
