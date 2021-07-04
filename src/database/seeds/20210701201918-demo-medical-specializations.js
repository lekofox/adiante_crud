module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('medical_specialization', [
    {
      id: 1,
      especialidade: 'Alergologia',
      created_at: new Date(),
      updated_at: new Date(),

    },
    {
      id: 2,
      especialidade: 'Angiologia',
      created_at: new Date(),
      updated_at: new Date(),

    },
    {
      id: 3,
      especialidade: 'Buco Maxilo',
      created_at: new Date(),
      updated_at: new Date(),

    },
    {
      id: 4,
      especialidade: 'Cardiologia Clínica',
      created_at: new Date(),
      updated_at: new Date(),

    },
    {
      id: 5,
      especialidade: 'Cardiologia Infantil',
      created_at: new Date(),
      updated_at: new Date(),

    },
    {
      id: 6,
      especialidade: 'Cirurgia cabeça e pescoço',
      created_at: new Date(),
      updated_at: new Date(),

    },
    {
      id: 7,
      especialidade: 'Cirurgia cardíaca',
      created_at: new Date(),
      updated_at: new Date(),

    },
    {
      id: 8,
      especialidade: 'Cirurgia de tórax',
      created_at: new Date(),
      updated_at: new Date(),

    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('medical_specialization', null, {}),
};
