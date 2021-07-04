import { Sequelize } from 'sequelize';
import Model from './baseModel';

class Specialization extends Model {
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
        tableName: 'specialization',
      },
    );
    return this;
  }

  static associate(models) {
    Specialization.belongsTo(models.DoctorSpecialization, { foreignKey: 'id', targetKey: 'specialization_id' });
    Specialization.belongsToMany(models.Doctor, { through: 'doctor_specialization' });
  }
}

export default Specialization;
