/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import axios from 'axios';
import Doctor from '../models/Doctor';
import DoctorSpecialization from '../models/DoctorSpecialization';
import Specialization from '../models/Specialization';

class PutDoctorController {
  async update(req, res) {
    try {
      const schema = await Yup.object().shape({
        nome: Yup.string().required(),
        cep: Yup.number().required(),
        telefone_fixo: Yup.number().required(),
        telefone_celular: Yup.number().required(),
        especialidades: Yup.number().required(),
      });
      const { crm } = req.params;
      const crmDoctor = await Doctor.findByPk(crm);
      const onUpdate = await DoctorSpecialization.findAll({
        where: { doctor_crm: crm },
      });

      if (!crmDoctor) {
        return res.status(404).json({
          message: 'Erro ao alterar os dados do médico; CRM selecionado não existe em nossa base',
        });
      }

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({
          message: 'Falha na validação; Por favor corrija os dados para alteração',
        });
      }

      const {
        nome, cep, telefone_fixo, telefone_celular, especialidades,
      } = req.body;

      if (especialidades.length < 2) {
        return res.status(400).json({ message: 'Você deve ter ao menos duas especialidades' });
      }
      for (let i = 0; i < especialidades.length; i++) {
        const specialization_id_check = especialidades[i];
        const find = await Specialization.findByPk(specialization_id_check);
        if (find === null) {
          return res.status(404).json({
            message: 'Especialidade(s) não encontrada; Por favor corrija os dados de cadastro',
          });
        }
      }
      const {
        logradouro, complemento, bairro, localidade, uf,
      } = await (await axios.get(`http://viacep.com.br/ws/${cep}/json/`)).data;
      for (let i = 0; i < onUpdate.length; i++) {
        await onUpdate[i].destroy();
      }
      await crmDoctor.update({
        nome, cep, telefone_fixo, telefone_celular, logradouro, complemento, bairro, localidade, uf,
      });
      const especializacoes = [];
      for (let i = 0; i < especialidades.length; i++) {
        const specialization_id = especialidades[i];
        const doctor_crm = crm;
        const find = await Specialization.findByPk(especialidades[i]);
        const specialization_name = find.dataValues.especialidade;
        especializacoes.push(specialization_name);
        if (find) {
          DoctorSpecialization.create({ specialization_id, doctor_crm, specialization_name });
        }
      }
      return res.status(200).json({
        crm,
        nome,
        cep,
        logradouro,
        complemento,
        bairro,
        localidade,
        uf,
        telefone_fixo,
        telefone_celular,
        especializacoes,

      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro inesperado; Por favor tente novamente',
      });
    }
  }
}

export default new PutDoctorController();
