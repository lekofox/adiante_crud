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
  // Busca no banco de dados um registro baseado no parametro informado
  async getByCRM(req, res) {
    try {
      const { crm } = req.params;
      // Buscar por um registro com base no parametro informado e retorna os dados do médico junto com as especialidades que ele tem
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
      // Caso nenhum registro seja encontrado, retorna erro 404 com a mensagem descrita abaixo
      if (!result) {
        return res.status(404).json({
          message: 'O CRM informado não foi encontrado',
        });
      }
      // Caso o valor do campo deletedAt de result for diferente de nulo, retorna erro 400 com a mensagem descrita abaixo
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
    // Busca no banco de dados todos os registro que contenham o parametro informado no seu campo de logradouro
    try {
      const { logradouro } = req.params;
      // Retorna todos os usuários com o logradouro informado no parametro, assim com as especialidades relacionadas.
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
      // Caso não exista nenhum registro com o parametro informado, retorna erro 404 e a mensagem descrita abaixo
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
    // Busca no banco de dados um registro baseado no parametro informado
    // Mesma estrutura do método acima
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
    // Busca no banco de dados um registro baseado no parametro informado
    // Mesma estrutura do método acima
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
    // Busca no banco de dados um registro baseado no parametro informado
    // Mesma estrutura do método acima
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
    // Busca no banco de dados um registro baseado no parametro informado
    // Mesma estrutura do método acima
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
    // Busca no banco de dados um registro baseado no parametro informado
    // Mesma estrutura do método acima
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
    // Busca no banco de dados um registro baseado no parametro informado
    // Mesma estrutura do método acima
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
    // Busca todos os registros que contenham em seu campo de especialidade o parametro informado
    try {
      const { especialidade } = req.params;
      // Busca por todas as especialidades (seja por ID ou pelo nome da especialidade) e retorna todos os médicos que possuem aquela especialidade
      const result = await Specialization.findAll({
        where: {
          // Define que caso o parametro passado seja igual ao ID (number) ou ao nome (string), retorne o médico associado.
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
      // Se o resultado da busca no banco de dados pela especialidade não encontrar nenhum registro, retorna erro 404 com a mensagem descrita abaixo
      if (result == '') {
        return res.status(404).json({
          message: 'Especialidade não encontrada',
        });
      }
      // Se achar a especialidade passada como parametro mas não houver nenhum médico associado a ela, retorna erro 400 com a mensagem descrita abaixo
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
