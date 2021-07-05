/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import Doctor from '../models/Doctor';

class DeleteDoctorController {
  // Realiza o Soft Delete de um registro
  async delete(req, res) {
    try {
      const { crm } = req.params;
      // Procura no banco de dados por um registro com o parametro informado
      const crmDoctor = await Doctor.findByPk(crm);
      // Se nenhum registro for encontrado, retorna 404 com a mensagem descrita abaixo.
      if (!crmDoctor) {
        return res.status(404).json({
          message: 'Erro ao remover; CRM selecionado não existe em nossa base',
        });
      }
      // Caso encontre um registro, é realizado o Soft Delete (campo DeletedAt passa a ter o valor da data/hora no momento da requisição)
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
}

export default new DeleteDoctorController();
