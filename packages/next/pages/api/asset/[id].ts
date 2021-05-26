import { validation, isValid } from '../../../libs/validation';
import { AssetController } from '@fibonacci/services';
import { AssetInterface } from '@fibonacci/interfaces';
import middlewareDefaultError from '../../../middlewares/middlewareDefaultError';
import middlewareValidationError from '../../../middlewares/middlewareValidationError';

const assetControler = new AssetController();

const list = async (_req, res) => {
  try {
    const accounts = await assetControler.list();
    res.status(200).json(accounts);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};

const get = async (req, res) => {
  try {
    const { error, id } = isValid(req.query, {
      id: validation.number().integer().required(),
    });
    if (error) return middlewareValidationError(error, res);
    const accounts = await assetControler.get(id);
    res.status(200).json(accounts);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};

const create = async (req, res) => {
  try {
    const { error, name, symbol, type } = isValid(req.body, {
      name: validation.string().required(),
      symbol: validation.string().required(),
      type: validation.string().valid(...Object.values(AssetInterface.AssetType)).required(),
    });
    if (error) return middlewareValidationError(error, res);
    const account = await assetControler.create({
      name,
      symbol,
      type,
    });
    res.status(201).json(account);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, id, name, symbol, type } = isValid({ ...req.query, ...req.body }, {
      id: validation.number().integer(),
      name: validation.string().required(),
      symbol: validation.string().required(),
      type: validation.string().valid(...Object.values(AssetInterface.AssetType)).required(),
    });
    if (error) return middlewareValidationError(error, res);
    const account = await assetControler.update({
      id,
      name,
      symbol,
      type,
    });
    res.status(201).json(account);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};

const remove = async (req, res) => {
  try {
    const { error, id } = isValid(req.query, {
      id: validation.number().integer().required(),
    });
    if (error) return middlewareValidationError(error, res);
    await assetControler.remove(id);
    res.status(201).json({ id });
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};

export default async (req, res) => {
  if (req.method === 'GET' && req.query.id) await get(req, res);
  else if (req.method === 'GET') await list(req, res);
  else if (req.method === 'POST') await create(req, res);
  else if (req.method === 'PATCH') await update(req, res);
  else if (req.method === 'DELETE') await remove(req, res);
  else res.status(405);
}
