module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('doctor_specialization', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    specialization_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'specialization', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    specialization_name: {
      type: Sequelize.STRING,
      allowNull: false,

    },
    doctor_crm: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'doctors', key: 'crm' },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL',
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('doctor_specialization'),
};
