import InvestmentController from '../../../controllers/InvestmentController';
import middlewareDefaultError from '../../../middlewares/middlewareDefaultError';

const investmentControler = new InvestmentController();

export default async (req, res) => {
  try {
    const investments = await investmentControler.list();
    res.status(200).json(investments);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};
