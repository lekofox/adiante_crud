module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('doctor_medical_specialization', [
    {
      medical_specialization_id: 1,
      doctor_crm: 1234567,
      medical_specialization_name: 'Alergologia',
      created_at: new Date(),
      updated_at: new Date(),

    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('doctor_medical_specialization', null, {}),
};
