/* eslint-disable eqeqeq */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import axios from 'axios';
import Doctor from '../models/Doctor';
import DoctorMedicalSpec from '../models/DoctorMedicalSpec';
import MedicalSpecialization from '../models/MedicalSpecialization';

class DoctorController {
  async store(req, res) {
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
      return res.status(400).json({ error: 'Médico já existe no sistema' });
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

    await Doctor.create({
      crm, nome, cep, telefone_fixo, telefone_celular, logradouro, complemento, bairro, localidade, uf,
    });

    for (let i = 0; i < especialidades.length; i++) {
      const medical_specialization_id = especialidades[i];
      const doctor_crm = crm;
      const find = await MedicalSpecialization.findByPk(especialidades[i]);
      const medical_specialization_name = find.dataValues.especialidade;

      if (find) {
        DoctorMedicalSpec.create({ medical_specialization_id, doctor_crm, medical_specialization_name });
      }
    }

    return res.json({
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

    });
  }

  async delete(req, res) {
    const { crm } = req.params;

    const crmDoctor = await Doctor.findByPk(crm);
    if (!crmDoctor) {
      return res.status(404).json({
        message: 'Erro ao remover; CRM selecionado não existe na base',
      });
    }
    await Doctor.destroy({ where: { crm } });
    return res.json({
      message: 'Médico removido com sucesso',
    });
  }

  async update(req, res) {
    const schema = await Yup.object().shape({
      nome: Yup.string().required(),
      cep: Yup.number().required(),
      telefone_fixo: Yup.number().required(),
      telefone_celular: Yup.number().required(),
      especialidades: Yup.number().required(),
    });
    const { crm } = req.params;
    const crmDoctor = await Doctor.findByPk(crm);
    const onUpdate = await DoctorMedicalSpec.findAll({
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

    const {
      logradouro, complemento, bairro, localidade, uf,
    } = await (await axios.get(`http://viacep.com.br/ws/${cep}/json/`)).data;
    for (let i = 0; i < onUpdate.length; i++) {
      await onUpdate[i].destroy();
    }
    await crmDoctor.update({
      nome, cep, telefone_fixo, telefone_celular, logradouro, complemento, bairro, localidade, uf,
    });

    for (let i = 0; i < especialidades.length; i++) {
      const medical_specialization_id = especialidades[i];
      const doctor_crm = crm;
      const find = await MedicalSpecialization.findByPk(especialidades[i]);
      const medical_specialization_name = find.dataValues.especialidade;

      if (find) {
        DoctorMedicalSpec.create({ medical_specialization_id, doctor_crm, medical_specialization_name });
      }
    }
    return res.json({
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

    });
  }

  async getByCRM(req, res) {
    const { crm } = req.params;
    const result = await Doctor.findOne({
      where: { crm },
      paranoid: false,
      include: {
        through: {
          attributes: [],
        },
        model: MedicalSpecialization,
        attributes: ['especialidade'],

      },
    });
    if (!result) {
      return res.status(404).json({
        message: `O CRM ${crm} não foi encontrado`,
      });
    }
    if (result.dataValues.deletedAt != null) {
      return res.status(400).json({
        message: `O CRM ${crm} foi desativado`,
      });
    }

    return res.status(200).json(result);
  }

  async getByAddress(req, res) {
    const { logradouro } = req.params;
    const result = await Doctor.findAll({
      where: { logradouro },
      include: {
        through: {
          attributes: [],
        },
        model: MedicalSpecialization,
        attributes: ['especialidade'],

      },
    });
    if (result == '') {
      return res.status(404).json({
        message: `Não existe nenhum médico residente no logradouro ${logradouro}`,
      });
    }
    return res.status(200).json(result);
  }

  async getByDistrict(req, res) {
    const { bairro } = req.params;
    const result = await Doctor.findAll({
      where: { bairro },
      include: {
        through: {
          attributes: [],
        },
        model: MedicalSpecialization,
        attributes: ['especialidade'],

      },
    });
    if (result == '') {
      return res.status(404).json({
        message: `Não existe nenhum médico residente no bairro ${bairro}`,
      });
    }
    return res.status(200).json(result);
  }

  async getByCity(req, res) {
    const { cidade } = req.params;
    const result = await Doctor.findAll({
      where: { localidade: cidade },
      include: {
        through: {
          attributes: [],
        },
        model: MedicalSpecialization,
        attributes: ['especialidade'],

      },
    });
    if (result == '') {
      return res.status(404).json({
        message: `Não existe nenhum médico residente na cidade de ${cidade}`,
      });
    }
    return res.status(200).json(result);
  }

  async getByState(req, res) {
    const { uf } = req.params;
    const result = await Doctor.findAll({
      where: { uf },
      include: {
        through: {
          attributes: [],
        },
        model: MedicalSpecialization,
        attributes: ['especialidade'],

      },
    });
    if (result == '') {
      return res.status(404).json({
        message: `Não existe nenhum médico residente no estado de ${uf}`,
      });
    }
    return res.status(200).json(result);
  }

  async getByPhone(req, res) {
    const { telefoneFixo } = req.params;
    const result = await Doctor.findAll({
      where: { telefone_fixo: telefoneFixo },
      include: {
        through: {
          attributes: [],
        },
        model: MedicalSpecialization,
        attributes: ['especialidade'],

      },
    });
    if (result == '') {
      return res.status(404).json({
        message: `Não existe nenhum médico com o telefone ${telefoneFixo} em nossa base`,
      });
    }
    return res.status(200).json(result);
  }

  async getByCellPhone(req, res) {
    const { telefoneCelular } = req.params;
    const result = await Doctor.findAll({
      where: { telefone_celular: telefoneCelular },
      include: {
        through: {
          attributes: [],
        },
        model: MedicalSpecialization,
        attributes: ['especialidade'],

      },
    });
    if (result == '') {
      return res.status(404).json({
        message: `Não existe nenhum médico com o telefone ${telefoneCelular} em nossa base`,
      });
    }
    return res.status(200).json(result);
  }

  async getByCEP(req, res) {
    const { CEP } = req.params;
    const result = await Doctor.findAll({
      where: { cep: CEP },
      include: {
        through: {
          attributes: [],
        },
        model: MedicalSpecialization,
        attributes: ['especialidade'],

      },
    });
    if (result == '') {
      return res.status(404).json({
        message: `Não foi encontrado nenhum médico cadastro com o CEP ${CEP}`,
      });
    }
    return res.status(200).json(result);
  }

  async getByMedicalSpecialization(req, res) {
    const { especialidade } = req.params;
    const result = await MedicalSpecialization.findAll({
      where: { especialidade },
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
  }
}

export default new DoctorController();
