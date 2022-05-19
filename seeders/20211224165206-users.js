module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('users', [
      {
        user_name: 'Rubel Amin',
        user_phone: '01648349010',
        user_mail: 'rubelamin@mail.com',
        user_role: 'admin',
        user_pass: '$2b$10$/oEkGOKwBzook1ymY314.ODwRFtA1dSd6DOsHqZIR3xxCW3tiZEkq',
        avatar: null,
        status: '2',
        create_at: '2022-05-10 10:30:51',
        update_at: null,
      },
      {
        user_name: 'Arif Uddin',
        user_phone: '01648349022',
        user_mail: 'arif@mail.com',
        user_role: 'user',
        user_pass: '$2b$10$/oEkGOKwBzook1ymY314.ODwRFtA1dSd6DOsHqZIR3xxCW3tiZEkq',
        avatar: null,
        status: '2',
        create_at: '2022-01-10 10:30:51',
        update_at: null,
      },

    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  },
};
