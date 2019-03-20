'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('labels', [
      {
        labelName: '家电',
        code: '1'
      },
      {
        labelName: '家具',
        code: '2'
      },
      {
        labelName: '手机',
        code: '3'
      },
      {
        labelName: '自行车',
        code: '4'
      },
      {
        labelName: '互联网',
        code: '5'
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
