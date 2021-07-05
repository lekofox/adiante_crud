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
  // Cria um novo registro de um médico
  async store(req, res) {
    try {
      // Validação realizada via YUP para que os valores descritos sejam obrigatórios no body
      const schema = await Yup.object().shape({
        crm: Yup.number().required(),
        nome: Yup.string().required(),
        cep: Yup.number().required(),
        telefone_fixo: Yup.number().required(),
        telefone_celular: Yup.number().required(),
        especialidades: Yup.number().required(),
      });

      // Caso o body não possua todos os campos marcados como obrigatório via YUP, retorna erro 400 com a mensagem descrita abaixo
      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({
          message: 'Falha ao cadastrar médico; Por favor corrija os dados de cadastro',
        });
      }

      // Busca no banco de dados por registros existentes com o CRM informado no body
      const doctorExist = await Doctor.findOne({
        where: { crm: req.body.crm },
      });

      // Procura por registros incluindo o modo paranoid (Soft Delete) para checar se existe algum registro com o campo deletedAt diferente de null
      const doctorNotActive = await Doctor.findOne({
        where: { crm: req.body.crm },
        paranoid: false,
      });

      // Caso já exista um registro com o CRM informado no body, retorna erro 400 com a mensagem descrita abaixo
      if (doctorExist) {
        return res.status(400).json({ message: 'Médico já existe no sistema' });
      }

      // Caso já exista um registro com o CRM informado e o campo deletedAt diferente de nulo, retorna erro 400 com a mensagem descrita abaixo
      if (doctorNotActive) {
        return res.status(400).json({
          message: 'Esse CRM foi desativado',
        });
      }

      const {
        crm, nome, cep, telefone_fixo, telefone_celular, especialidades,
      } = req.body;

      // Caso o número de especialidades informadas no body seja menor que dois, retorna erro 400 com a mensagem descrita abaixo
      if (especialidades.length < 2) {
        return res.status(400).json({ message: 'Você deve ter ao menos duas especialidades' });
      }
      // Caso a quantidade de caracteres do CRM informado no body seja maior que sete, retorna erro 400 com a mensagem descrita abaixo
      if (crm.length > 7) {
        return res.status(400).json({
          message: 'O CRM não pode conter mais que 7 caracteres',
        });
      }

      // Faz um GET na API do viacep com base no CEP informado no body e atribui o valor de retorno à constante desestruturada { logradouro, complemento, bairro, localidade e uf}
      const {
        logradouro, complemento, bairro, localidade, uf,
      } = await (await axios.get(`http://viacep.com.br/ws/${cep}/json/`)).data;

      // Faz a checagem se todas as especialidades passadas no body existem
      for (let i = 0; i < especialidades.length; i++) {
        const specialization_id_check = especialidades[i];
        const find = await Specialization.findByPk(specialization_id_check);

        // Se o retorno da constante find for nulo em qualquer posição do array informado, retorna erro 404 com a mensagem descrita abaixo
        if (find === null) {
          return res.status(404).json({
            message: 'Especialidade(s) não encontrada; Por favor corrija os dados de cadastro',
          });
        }
      }

      // Caso não haja exceções, cria todos os dados informados no body e os dados coletados via fetch na API do viacep
      await Doctor.create({
        crm, nome, cep, telefone_fixo, telefone_celular, logradouro, complemento, bairro, localidade, uf,
      });

      /* Após a criação do médico na tabela 'doctors', faz a criação na tabela relacional 'doctor_specialization' usando o CRM do body como doctor_crm
      e utilizando as especialidades informadas no body da requisição como specialization_id */

      const especializacoes = [];
      for (let i = 0; i < especialidades.length; i++) {
        const specialization_id = especialidades[i];
        const doctor_crm = crm;
        const result = await Specialization.findByPk(especialidades[i]);

        // Busca o nome da especialidade e atribui à constante specialization_name
        const specialization_name = result.dataValues.especialidade;

        // Realiza o push na constate especializacoes para retornar de forma mais intuitiva ao usuário
        especializacoes.push(specialization_name);

        // Caso o resultado seja positivo em todas as validações anteriores, cria um registro na tabela 'doctor_specialization' com cada especialidade informada
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
      // Reativa um registro com base no parametro passado
      const { crm } = req.params;

      // Procura por registros incluindo o modo paranoid (Soft Delete) para checar se existe algum registro com o campo deletedAt diferente de null

      const doctorExists = await Doctor.findOne({
        where: { crm },
        paranoid: false,
      });

      // Caso não encontre nenhum registro , retorna erro 404 com a mensagem descrita abaixo
      if (!doctorExists) {
        return res.status(404).json({
          message: 'Não foi encontrado nenhum médico cadastrado com o CRM informado',
        });
      }
      // Caso encontre um registro e ele tenha o campo deletedAt igual a null, retorna erro 400 com a mensagem descrita abaixo
      if (doctorExists.dataValues.deletedAt == null) {
        return res.status(400).json({
          message: 'O CRM informado já está ativo',
        });
      }
      // Caso não haja exceções, atribui o valor de null ao campo deletedAt de um registro que possua o parametro passado, reativando o médico
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
