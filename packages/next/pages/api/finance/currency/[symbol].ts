import { validation, isValid } from '../../../../libs/validation';
import { FinanceController } from '@fibonacci/services';
import middlewareDefaultError from '../../../../middlewares/middlewareDefaultError';
import middlewareValidationError from '../../../../middlewares/middlewareValidationError';

const controller = new FinanceController();

export default async (req, res) => {
  try {
    const { error, symbol } = isValid(req.query, {
      symbol: validation.string().required(),
    });
    if (error) return middlewareValidationError(error, res);
    const asset = await controller.getCurrencyPrice(symbol);
    res.status(200).json(asset);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};
