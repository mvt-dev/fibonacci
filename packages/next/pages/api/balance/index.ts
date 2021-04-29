import { BalanceController } from '@fibonacci/services';
import middlewareDefaultError from '../../../middlewares/middlewareDefaultError';

const controller = new BalanceController();

export default async (req, res) => {
  try {
    const balance = await controller.list();
    res.status(200).json(balance);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};
