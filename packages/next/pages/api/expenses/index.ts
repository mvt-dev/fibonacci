import ExpensesController from '../../../controllers/ExpensesController';
import middlewareDefaultError from '../../../middlewares/middlewareDefaultError';

const controller = new ExpensesController();

export default async (req, res) => {
  try {
    const expenses = await controller.list();
    res.status(200).json(expenses);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};
