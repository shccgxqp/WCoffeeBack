'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'Origin_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Origins',
        key: 'id',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'Origin_id');
  },
};
