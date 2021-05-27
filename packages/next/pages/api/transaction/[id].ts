import { validation, isValid } from '../../../libs/validation';
import TransactionController from '../../../controllers/TransactionController';
import middlewareDefaultError from '../../../middlewares/middlewareDefaultError';
import middlewareValidationError from '../../../middlewares/middlewareValidationError';

const controller = new TransactionController();

const list = async (req, res) => {
  try {
    const { error, from, to } = isValid(req.query, {
      from: validation.string().required(),
      to: validation.string().required(),
    });
    if (error) return middlewareValidationError(error, res);
    const accounts = await controller.list(from, to);
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
    const account = await controller.get(id);
    res.status(200).json(account);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};

const create = async (req, res) => {
  try {
    const { error, date, account, type, category, description, amount, value } = isValid(req.body, {
      date: validation.string().required(),
      account: validation.number().integer().required(),
      type: validation.string().required(),
      category: validation.number().integer().empty(''),
      description: validation.string().required(),
      amount: validation.number().required(),
      value: validation.number().required(),
    });
    if (error) return middlewareValidationError(error, res);
    const transaction = await controller.create({
      date,
      account,
      type,
      category,
      description,
      amount,
      value,
    });
    res.status(201).json(transaction);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, id, date, account, type, category, description, amount, value } = isValid({ ...req.query, ...req.body }, {
      id: validation.number().integer().required(),
      date: validation.string().required(),
      account: validation.number().integer().required(),
      type: validation.string().required(),
      category: validation.number().integer().empty(''),
      description: validation.string().required(),
      amount: validation.number().required(),
      value: validation.number().required(),
    });
    if (error) return middlewareValidationError(error, res);
    const transaction = await controller.update({
      id,
      date,
      account,
      type,
      category,
      description,
      amount,
      value,
    });
    res.status(201).json(transaction);
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
    await controller.remove(id);
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
