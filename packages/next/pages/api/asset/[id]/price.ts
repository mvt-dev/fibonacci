import { validation, isValid } from '../../../../libs/validation';
import AssetController from '../../../../controllers/AssetController';
import middlewareDefaultError from '../../../../middlewares/middlewareDefaultError';
import middlewareValidationError from '../../../../middlewares/middlewareValidationError';

const controller = new AssetController();

export default async (req, res) => {
  try {
    const { error, id, from, to } = isValid({ ...req.query, ...req.params }, {
      id: validation.number().integer().required(),
      from: validation.string().required(),
      to: validation.string().required(),
    });
    if (error) return middlewareValidationError(error, res);
    const prices = await controller.getPrices(id, from, to);
    res.status(200).json(prices);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};
