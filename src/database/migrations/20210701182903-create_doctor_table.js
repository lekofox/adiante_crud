module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('doctors', {
    crm: {
      type: 'int(7)',
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    nome: {
      type: 'varchar(120)',
      allowNull: false,
      length: 120,
    },
    cep: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    telefone_fixo: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    telefone_celular: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    logradouro: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    complemento: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    bairro: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    localidade: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    uf: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    created_at: {
      type: Sequelize.DATE,

    },
    updated_at: {
      type: Sequelize.DATE,

    },
    deleted_at: {
      type: Sequelize.DATE,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('doctors'),
};
