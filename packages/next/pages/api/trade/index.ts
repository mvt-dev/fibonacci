import TradeController from '../../../controllers/TradeController';
import middlewareDefaultError from '../../../middlewares/middlewareDefaultError';

const controller = new TradeController();

export default async (req, res) => {
  try {
    const trades = await controller.list();
    res.status(200).json(trades);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};
