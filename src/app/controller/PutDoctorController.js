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
  // Realiza alterações de todos os dados de um registro com base no parametro passado
  async update(req, res) {
    try {
      // Validação realizada via YUP para que os valores descritos sejam obrigatórios no body
      const schema = await Yup.object().shape({
        nome: Yup.string().required(),
        cep: Yup.number().required(),
        telefone_fixo: Yup.number().required(),
        telefone_celular: Yup.number().required(),
        especialidades: Yup.number().required(),
      });
      const { crm } = req.params;

      // Busca um registro com o CRM igual ao parametro passado
      const crmDoctor = await Doctor.findByPk(crm);

      // Busca na tabela relacional 'doctor_specialization' todos os registros do CRM passado como parametro para uso futuro na função
      const onUpdate = await DoctorSpecialization.findAll({
        where: { doctor_crm: crm },
      });

      // Caso não encontre um registro com o CRM passado como parametro, retorna erro 404 com a mensagem descrita abaixo
      if (!crmDoctor) {
        return res.status(404).json({
          message: 'Erro ao alterar os dados do médico; CRM selecionado não existe em nossa base',
        });
      }

      // Caso o body não possua todos os campos marcados como obrigatório via YUP, retorna erro 400 com a mensagem descrita abaixo
      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({
          message: 'Falha na validação; Por favor corrija os dados para alteração',
        });
      }

      const {
        nome, cep, telefone_fixo, telefone_celular, especialidades,
      } = req.body;

      // Caso o número de especialidades informadas no body seja menor que dois, retorna erro 400 com a mensagem descrita abaixo
      if (especialidades.length < 2) {
        return res.status(400).json({ message: 'Você deve ter ao menos duas especialidades' });
      }

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
      // Faz um GET na API do viacep com base no CEP informado no body e atribui o valor de retorno à constante desestruturada { logradouro, complemento, bairro, localidade e uf}
      const {
        logradouro, complemento, bairro, localidade, uf,
      } = await (await axios.get(`http://viacep.com.br/ws/${cep}/json/`)).data;

      // Para cada registro encontrado na constante onUpdate, busca na tabela relacional 'doctor_specialization' e registra os registros anteriores.
      for (let i = 0; i < onUpdate.length; i++) {
        await onUpdate[i].destroy();
      }

      // Caso não haja exceções, atualiza todos os dados informados no body e os dados coletados via fetch na API do viacep
      await crmDoctor.update({
        nome, cep, telefone_fixo, telefone_celular, logradouro, complemento, bairro, localidade, uf,
      });

      const especializacoes = [];

      /* Após a atualizacao dos dados do médico na tabela 'doctors', faz a criação na tabela relacional 'doctor_specialization' usando o CRM doctor_crm
      e utilizando as especialidades informadas no body da requisição como specialization_id */
      for (let i = 0; i < especialidades.length; i++) {
        const specialization_id = especialidades[i];
        const doctor_crm = crm;
        const find = await Specialization.findByPk(especialidades[i]);

        // Busca o nome da especialidade e atribui à constante specialization_name
        const specialization_name = find.dataValues.especialidade;

        // Realiza o push na constate especializacoes para retornar de forma mais intuitiva ao usuário
        especializacoes.push(specialization_name);

        // Caso o resultado seja positivo em todas as validações anteriores, cria um registro na tabela 'doctor_specialization' com cada especialidade informada
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
