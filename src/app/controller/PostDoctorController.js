/* eslint-disable linebreak-style */
/* eslint-disable class-methods-use-this */
/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable linebreak-style */
import * as Yup from 'yup';
import axios from 'axios';
import Doctor from '../models/Doctor';
import DoctorSpecialization from '../models/DoctorSpecialization';
import Specialization from '../models/Specialization';

class PostDoctorController {
  async store(req, res) {
    try {
      const schema = await Yup.object().shape({
        crm: Yup.number().required(),
        nome: Yup.string().required(),
        cep: Yup.number().required(),
        telefone_fixo: Yup.number().required(),
        telefone_celular: Yup.number().required(),
        especialidades: Yup.number().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({
          message: 'Falha ao cadastrar médico; Por favor corrija os dados de cadastro',
        });
      }

      const doctorExist = await Doctor.findOne({
        where: { crm: req.body.crm },
      });
      const doctorNotActive = await Doctor.findOne({
        where: { crm: req.body.crm },
        paranoid: false,
      });

      if (doctorExist) {
        return res.status(400).json({ message: 'Médico já existe no sistema' });
      }
      if (doctorNotActive) {
        return res.status(400).json({
          message: 'Esse CRM foi desativado',
        });
      }

      const {
        crm, nome, cep, telefone_fixo, telefone_celular, especialidades,
      } = req.body;
      if (especialidades.length < 2) {
        return res.status(400).json({ message: 'Você deve ter ao menos duas especialidades' });
      }
      if (crm.length > 7) {
        return res.status(400).json({
          message: 'O CRM não pode conter mais que 7 caracteres',
        });
      }

      const {
        logradouro, complemento, bairro, localidade, uf,
      } = await (await axios.get(`http://viacep.com.br/ws/${cep}/json/`)).data;

      for (let i = 0; i < especialidades.length; i++) {
        const specialization_id_check = especialidades[i];
        const find = await Specialization.findByPk(specialization_id_check);
        if (find === null) {
          return res.status(404).json({
            message: 'Especialidade(s) não encontrada; Por favor corrija os dados de cadastro',
          });
        }
      }

      await Doctor.create({
        crm, nome, cep, telefone_fixo, telefone_celular, logradouro, complemento, bairro, localidade, uf,
      });

      const especializacoes = [];
      for (let i = 0; i < especialidades.length; i++) {
        const specialization_id = especialidades[i];
        const doctor_crm = crm;
        const result = await Specialization.findByPk(especialidades[i]);
        const specialization_name = result.dataValues.especialidade;
        especializacoes.push(specialization_name);
        if (result) {
          DoctorSpecialization.create({ specialization_id, doctor_crm, specialization_name });
        }
      }

      return res.status(201).json({
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

  async reactivateDoctor(req, res) {
    try {
      const { crm } = req.params;
      const doctorExists = await Doctor.findOne({
        where: { crm },
        paranoid: false,
      });

      if (!doctorExists) {
        return res.status(404).json({
          message: 'Não foi encontrado nenhum médico cadastrado com o CRM informado',
        });
      }
      if (doctorExists.dataValues.deletedAt == null) {
        return res.status(400).json({
          message: 'O CRM informado já está ativo',
        });
      }
      await Doctor.restore({
        where: { crm },
      });

      return res.status(200).json({
        message: 'O CRM informado foi reativado',
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro inesperado; Por favor tente novamente',
      });
    }
  }
}

export default new PostDoctorController();
