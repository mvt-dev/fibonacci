import { validation, isValid } from '../../../libs/validation';
import { CategoryController } from '@fibonacci/services';
import { CategoryInterface } from '@fibonacci/interfaces';
import middlewareDefaultError from '../../../middlewares/middlewareDefaultError';
import middlewareValidationError from '../../../middlewares/middlewareValidationError';

const categoryControler = new CategoryController();

const list = async (_req, res) => {
  try {
    const accounts = await categoryControler.list();
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
    const accounts = await categoryControler.get(id);
    res.status(200).json(accounts);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};

const create = async (req, res) => {
  try {
    const { error, name, color, tag } = isValid(req.body, {
      name: validation.string().required(),
      color: validation.string().required(),
      tag: validation.string().valid(...Object.values(CategoryInterface.CategoryTag)).required(),
    });
    if (error) return middlewareValidationError(error, res);
    const account = await categoryControler.create({
      name,
      color,
      tag,
    });
    res.status(201).json(account);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, id, name, color, tag } = isValid({ ...req.query, ...req.body }, {
      id: validation.number().integer(),
      name: validation.string().required(),
      color: validation.string().required(),
      tag: validation.string().valid(...Object.values(CategoryInterface.CategoryTag)).required(),
    });
    if (error) return middlewareValidationError(error, res);
    const account = await categoryControler.update({
      id,
      name,
      color,
      tag,
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
    await categoryControler.remove(id);
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
