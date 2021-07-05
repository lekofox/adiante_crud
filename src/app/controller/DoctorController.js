/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import axios from 'axios';
import { Op } from 'sequelize';
import Doctor from '../models/Doctor';
import DoctorSpecialization from '../models/DoctorSpecialization';
import Specialization from '../models/Specialization';

class DoctorController {
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

  async delete(req, res) {
    try {
      const { crm } = req.params;

      const crmDoctor = await Doctor.findByPk(crm);
      if (!crmDoctor) {
        return res.status(404).json({
          message: 'Erro ao remover; CRM selecionado não existe em nossa base',
        });
      }
      await Doctor.destroy({ where: { crm } });
      return res.status(200).json({
        message: 'Médico removido com sucesso',
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro inesperado; Por favor tente novamente',
      });
    }
  }

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

  async getByCRM(req, res) {
    try {
      const { crm } = req.params;
      const result = await Doctor.findOne({
        where: { crm },
        paranoid: false,
        include: {
          through: {
            attributes: [],
          },
          model: Specialization,
          attributes: ['especialidade'],

        },
      });
      if (!result) {
        return res.status(404).json({
          message: 'O CRM informado não foi encontrado',
        });
      }
      if (result.dataValues.deletedAt != null) {
        return res.status(400).json({
          message: 'O CRM informado foi desativado',
        });
      }

      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro inesperado; Por favor tente novamente',
      });
    }
  }

  async getByAddress(req, res) {
    try {
      const { logradouro } = req.params;
      const result = await Doctor.findAll({
        where: { logradouro },
        include: {
          through: {
            attributes: [],
          },
          model: Specialization,
          attributes: ['especialidade'],

        },
      });
      if (result == '') {
        return res.status(404).json({
          message: 'Não existe nenhum médico cadastrado no logradouro informado',
        });
      }
      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro inesperado; Por favor tente novamente',
      });
    }
  }

  async getByDistrict(req, res) {
    try {
      const { bairro } = req.params;
      const result = await Doctor.findAll({
        where: { bairro },
        include: {
          through: {
            attributes: [],
          },
          model: Specialization,
          attributes: ['especialidade'],

        },
      });
      if (result == '') {
        return res.status(404).json({
          message: 'Não existe nenhum médico cadastrado no bairro informado',
        });
      }
      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro inesperado; Por favor tente novamente',
      });
    }
  }

  async getByCity(req, res) {
    try {
      const { localidade } = req.params;
      const result = await Doctor.findAll({
        where: { localidade },
        include: {
          through: {
            attributes: [],
          },
          model: Specialization,
          attributes: ['especialidade'],

        },
      });
      if (result == '') {
        return res.status(404).json({
          message: 'Não existe nenhum médico cadastrado na cidade informada',
        });
      }
      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro inesperado; Por favor tente novamente',
      });
    }
  }

  async getByState(req, res) {
    try {
      const { uf } = req.params;
      const result = await Doctor.findAll({
        where: { uf },
        include: {
          through: {
            attributes: [],
          },
          model: Specialization,
          attributes: ['especialidade'],

        },
      });
      if (result == '') {
        return res.status(404).json({
          message: 'Não existe nenhum médico cadastrado no UF informado',
        });
      }
      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro inesperado; Por favor tente novamente',
      });
    }
  }

  async getByPhone(req, res) {
    try {
      const { telefone_fixo } = req.params;
      const result = await Doctor.findAll({
        where: { telefone_fixo },
        include: {
          through: {
            attributes: [],
          },
          model: Specialization,
          attributes: ['especialidade'],

        },
      });
      if (result == '') {
        return res.status(404).json({
          message: 'Não existe nenhum médico com o telefone informado cadastrado',
        });
      }
      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro inesperado; Por favor tente novamente',
      });
    }
  }

  async getByCellPhone(req, res) {
    try {
      const { telefone_celular } = req.params;
      const result = await Doctor.findAll({
        where: { telefone_celular },
        include: {
          through: {
            attributes: [],
          },
          model: Specialization,
          attributes: ['especialidade'],

        },
      });
      if (result == '') {
        return res.status(404).json({
          message: 'Não existe nenhum médico com o telefone celular informado cadastrado',
        });
      }
      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro inesperado; Por favor tente novamente',
      });
    }
  }

  async getByCEP(req, res) {
    try {
      const { CEP } = req.params;
      const result = await Doctor.findAll({
        where: { CEP },
        include: {
          through: {
            attributes: [],
          },
          model: Specialization,
          attributes: ['especialidade'],

        },
      });
      if (result == '') {
        return res.status(404).json({
          message: 'Não foi encontrado nenhum médico cadastrado com o CEP informado',
        });
      }
      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro inesperado; Por favor tente novamente',
      });
    }
  }

  async getBySpecialization(req, res) {
    try {
      const { especialidade } = req.params;
      const result = await Specialization.findAll({
        where: {

          [Op.or]: [
            { id: especialidade },
            { especialidade },
          ],
        },
        attributes: ['especialidade'],
        include: {
          through: {
            attributes: [],
          },
          model: Doctor,

          attributes: ['crm', 'nome', 'telefone_fixo', 'telefone_celular', 'cep', 'logradouro', 'bairro', 'localidade', 'uf'],

        },
      });
      if (result == '') {
        return res.status(404).json({
          message: 'Especialidade não encontrada',
        });
      }
      if (result[0].Doctors.length == 0) {
        return res.status(400).json({
          message: 'Não existe nenhum médico com essa especialidade em nossa base',
        });
      }
      // eslint-disable-next-line eqeqeq

      return res.status(200).json(result);
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

export default new DoctorController();
