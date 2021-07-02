import { Sequelize } from 'sequelize';
import Model from './baseModel';

class DoctorMedicalSpec extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                medical_specialization_id: Sequelize.INTEGER,
                doctor_crm: {
                    type: Sequelize.INTEGER,
                    onUpdate: 'SET NULL'
                },
                medical_specialization_name: Sequelize.STRING,
            }, 
            {
            sequelize,
            underscored: true,
            tableName: 'doctor_medical_specialization',
        },
        )
        return this
    }
    static associate(models){
        DoctorMedicalSpec.hasMany(models.Doctor, { foreignKey: 'crm', targetKey: 'doctor_crm'})
        DoctorMedicalSpec.hasMany(models.MedicalSpecialization, {foreignKey: 'id'})
        
      }

}

export default DoctorMedicalSpec;