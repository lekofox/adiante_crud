module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('doctors', [
    {
      crm: 1234567,
      nome: 'Leandro Dias',
      cep: '06340340',
      telefone_fixo: 123456789,
      telefone_celular: 987654321,
      logradouro: 'Rua Hercules Abruzzesse',
      complemento: 67,
      bairro: 'Parque Santa Teresa',
      localidade: 'Carapicuíba',
      uf: 'SP',
      created_at: new Date(),
      updated_at: new Date(),

    },

  ]),
  down: (queryInterface) => queryInterface.bulkDelete('doctors', null, {}),
};
