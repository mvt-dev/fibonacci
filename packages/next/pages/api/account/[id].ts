import { validation, isValid } from '../../../libs/validation';
import AccountController from '../../../controllers/AccountController';
import { AccountType, AccountCurrency } from '../../../interfaces/AccountInterface';
import middlewareDefaultError from '../../../middlewares/middlewareDefaultError';
import middlewareValidationError from '../../../middlewares/middlewareValidationError';

const accountControler = new AccountController();

const list = async (_req, res) => {
  try {
    const accounts = await accountControler.list();
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
    const accounts = await accountControler.get(id);
    res.status(200).json(accounts);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};

const create = async (req, res) => {
  try {
    const { error, name, type, currency } = isValid(req.body, {
      name: validation.string().required(),
      type: validation.string().valid(...Object.values(AccountType)).required(),
      currency: validation.string().valid(...Object.values(AccountCurrency)).required(),
    });
    if (error) return middlewareValidationError(error, res);
    const account = await accountControler.create({
      name,
      type,
      currency,
    });
    res.status(201).json(account);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, id, name, type, currency } = isValid({ ...req.query, ...req.body }, {
      id: validation.number().integer().required(),
      name: validation.string().required(),
      type: validation.string().valid(...Object.values(AccountType)).required(),
      currency: validation.string().valid(...Object.values(AccountCurrency)).required(),
    });
    if (error) return middlewareValidationError(error, res);
    const account = await accountControler.update({
      id,
      name,
      type,
      currency,
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
    await accountControler.remove(id);
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
