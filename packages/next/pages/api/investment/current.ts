import { InvestmentController } from '@fibonacci/services';
import middlewareDefaultError from '../../../middlewares/middlewareDefaultError';

const investmentControler = new InvestmentController();

export default async (req, res) => {
  try {
    const investments = await investmentControler.listCurrent();
    res.status(200).json(investments);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};