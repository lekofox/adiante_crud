import { Sequelize } from 'sequelize';
import Model from './baseModel';

class DoctorSpecialization extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        specialization_id: Sequelize.INTEGER,
        doctor_crm: Sequelize.INTEGER,
        specialization_name: Sequelize.STRING,
      },
      {
        sequelize,
        underscored: true,
        tableName: 'doctor_specialization',
      },
    );
    return this;
  }

  static associate(models) {
    DoctorSpecialization.hasMany(models.Doctor, { foreignKey: 'crm', targetKey: 'doctor_crm' });
    DoctorSpecialization.hasMany(models.Specialization, { foreignKey: 'id' });
  }
}

export default DoctorSpecialization;
