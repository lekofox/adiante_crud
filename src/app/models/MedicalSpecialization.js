import { Sequelize } from 'sequelize';
import Model from './baseModel';

class MedicalSpecialization extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        especialidade: Sequelize.STRING,
      },
      {
        sequelize,
        underscored: true,
        tableName: 'medical_specialization',
      },
    );
    return this;
  }

  static associate(models) {
    MedicalSpecialization.belongsTo(models.DoctorMedicalSpec, { foreignKey: 'id', targetKey: 'medical_specialization_id' });
    MedicalSpecialization.belongsToMany(models.Doctor, { through: 'doctor_medical_specialization' });
  }
}

export default MedicalSpecialization;
