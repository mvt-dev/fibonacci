// import { validation, isValid } from '../../../libs/validation';
import { AssetController } from '@fibonacci/services';
import middlewareDefaultError from '../../../middlewares/middlewareDefaultError';
// import middlewareValidationError from '../../../middlewares/middlewareValidationError';

const controller = new AssetController();

export default async (req, res) => {
  try {
    if (req.method !== 'PATCH') return res.status(405);
    // const { error, symbol } = isValid(req.query, {
    //   symbol: validation.string().required(),
    // });
    // if (error) return middlewareValidationError(error, res);
    const results = await controller.updatePrices();
    res.status(200).json(results);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};
