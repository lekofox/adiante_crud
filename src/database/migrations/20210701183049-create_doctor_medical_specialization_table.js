'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('doctor_medical_specialization', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      medical_specialization_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {model: 'medical_specialization', key:'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      medical_specialization_name:{
        type: Sequelize.STRING,
        allowNull: false,
 
      },
      doctor_crm: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {model: 'doctors', key:'crm'},
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },

      
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('doctor_medical_specialization');
  },
};
