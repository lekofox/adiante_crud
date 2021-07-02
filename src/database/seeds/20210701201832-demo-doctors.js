module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('doctors', [
    {
      crm: 1234567,
      nome: 'Leandro Dias',
      cep: 15432321,
      telefone_fixo: 123456789,
      telefone_celular: 987654321,
      created_at: new Date(),
      updated_at: new Date(),

    },

  ]),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('doctors', null, {}),
};
