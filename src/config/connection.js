import { Sequelize } from 'sequelize';
import database from './database';
import DoctorSpecialization from '../app/models/DoctorSpecialization';
import Doctors from '../app/models/Doctor';
import Specialization from '../app/models/Specialization';

const connection = new Sequelize(database);

DoctorSpecialization.init(connection);
Doctors.init(connection);
Specialization.init(connection);

DoctorSpecialization.associate(connection.models);
Doctors.associate(connection.models);
Specialization.associate(connection.models);

export default connection;
