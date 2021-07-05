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
}

export default new DeleteDoctorController();
