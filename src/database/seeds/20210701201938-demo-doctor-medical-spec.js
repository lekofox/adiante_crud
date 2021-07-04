module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('doctor_specialization', [
    {
      specialization_id: 1,
      doctor_crm: 1234567,
      specialization_name: 'Alergologia',
      created_at: new Date(),
      updated_at: new Date(),

    },
    {
      specialization_id: 2,
      doctor_crm: 1234567,
      specialization_name: 'Angiologia',
      created_at: new Date(),
      updated_at: new Date(),

    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('doctor_specialization', null, {}),
};
