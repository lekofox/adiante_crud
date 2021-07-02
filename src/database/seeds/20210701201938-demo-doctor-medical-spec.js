'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('doctor_medical_specialization', [
      {
      medical_specialization_id: 1,
      doctor_crm: 1234567,
      created_at: new Date(),
      updated_at: new Date(),

    },
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('doctor_medical_specialization', null, {});
  }
};