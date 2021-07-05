/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */

import { Op } from 'sequelize';
import Doctor from '../models/Doctor';
import Specialization from '../models/Specialization';

class GetDoctorController {
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
}

export default new GetDoctorController();
