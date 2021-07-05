import { Sequelize } from 'sequelize';
import Model from './baseModel';

class Doctor extends Model {
  static init(sequelize) {
    super.init(
      {
        crm: {
          primaryKey: true,
          type: Sequelize.INTEGER,
          length: 7,
        },
        nome: Sequelize.STRING,
        cep: Sequelize.INTEGER,
        telefone_fixo: Sequelize.INTEGER,
        telefone_celular: Sequelize.INTEGER,
        logradouro: Sequelize.STRING,
        localidade: Sequelize.STRING,
        uf: Sequelize.STRING,
        complemento: Sequelize.STRING,
        bairro: Sequelize.STRING,

      },
      {
        sequelize,
        underscored: true,
        // Soft Delete set to true
        paranoid: true,
        tableName: 'doctors',
      },
    );
    return this;
  }

  static associate(models) {
    Doctor.belongsTo(models.DoctorSpecialization, { foreignKey: 'crm', targetKey: 'doctor_crm' });
    Doctor.belongsToMany(models.Specialization, { through: 'doctor_specialization' });
  }
}

export default Doctor;
