/* eslint-disable linebreak-style */
import { Router } from 'express';
import GetDoctorController from './app/controller/GetDoctorController';
import PostDoctorController from './app/controller/PostDoctorController';
import DeleteDoctorController from './app/controller/DeleteDoctorController';
import PutDoctorController from './app/controller/PutDoctorController';

const routes = new Router();

routes.post('/adiante-api/v1/medicos', PostDoctorController.store);
routes.post('/adiante-api/v1/medicos/reativar/:crm', PostDoctorController.reactivateDoctor);
routes.put('/adiante-api/v1/medicos/:crm', PutDoctorController.update);
routes.delete('/adiante-api/v1/medicos/:crm', DeleteDoctorController.delete);
routes.get('/adiante-api/v1/medicos/CRM/:crm', GetDoctorController.getByCRM);
routes.get('/adiante-api/v1/medicos/logradouro/:logradouro', GetDoctorController.getByAddress);
routes.get('/adiante-api/v1/medicos/bairro/:bairro', GetDoctorController.getByDistrict);
routes.get('/adiante-api/v1/medicos/cidade/:localidade', GetDoctorController.getByCity);
routes.get('/adiante-api/v1/medicos/uf/:uf', GetDoctorController.getByState);
routes.get('/adiante-api/v1/medicos/telefone/:telefone_fixo', GetDoctorController.getByPhone);
routes.get('/adiante-api/v1/medicos/celular/:telefone_celular', GetDoctorController.getByCellPhone);
routes.get('/adiante-api/v1/medicos/CEP/:CEP', GetDoctorController.getByCEP);
routes.get('/adiante-api/v1/medicos/especialidade/:especialidade', GetDoctorController.getBySpecialization);



export default routes;
