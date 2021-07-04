/* eslint-disable linebreak-style */
import { Router } from 'express';
import DoctorController from './app/controller/DoctorController';

const routes = new Router();

routes.post('/adiante-api/v1/medicos', DoctorController.store);
routes.delete('/adiante-api/v1/medicos/:crm', DoctorController.delete);
routes.get('/adiante-api/v1/medicos/CRM/:crm', DoctorController.getByCRM);
routes.get('/adiante-api/v1/medicos/logradouro/:logradouro', DoctorController.getByAddress);
routes.get('/adiante-api/v1/medicos/bairro/:bairro', DoctorController.getByDistrict);
routes.get('/adiante-api/v1/medicos/cidade/:localidade', DoctorController.getByCity);
routes.get('/adiante-api/v1/medicos/uf/:uf', DoctorController.getByState);
routes.get('/adiante-api/v1/medicos/telefone/:telefone_fixo', DoctorController.getByPhone);
routes.get('/adiante-api/v1/medicos/celular/:telefone_celular', DoctorController.getByCellPhone);
routes.get('/adiante-api/v1/medicos/CEP/:CEP', DoctorController.getByCEP);
routes.get('/adiante-api/v1/medicos/especialidade/:especialidade', DoctorController.getBySpecialization);
routes.put('/adiante-api/v1/medicos/:crm', DoctorController.update);
routes.post('/adiante-api/v1/medicos/reativar/:crm', DoctorController.reactivateDoctor);

export default routes;
