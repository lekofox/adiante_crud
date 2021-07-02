import { Sequelize } from 'sequelize';
import database from './database';
import DoctorMedicalSpec from '../app/models/DoctorMedicalSpec';
import Doctors from '../app/models/Doctor'
import MedicalSpecialization from '../app/models/MedicalSpecialization';


const connection = new Sequelize(database);

DoctorMedicalSpec.init(connection)
Doctors.init(connection);
MedicalSpecialization.init(connection)


DoctorMedicalSpec.associate(connection.models)
Doctors.associate(connection.models)
MedicalSpecialization.associate(connection.models)






export default connection;
