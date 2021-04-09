import Joi from 'joi';
import { AccountController } from '@fibonacci/services';
import { AccountInterface } from '@fibonacci/interfaces';
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
    const {error, value} = Joi.object().keys({
      id: Joi.number().integer().required(),
    }).validate(req.query);
    if (error) return middlewareValidationError(error, res);
    const accounts = await accountControler.get(value.id);
    res.status(200).json(accounts);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};

const create = async (req, res) => {
  try {
    const {error, value} = Joi.object().keys({
      name: Joi.string().required(),
      type: Joi.string().valid(...Object.values(AccountInterface.AccountType)).required(),
    }).validate(req.body);
    if (error) return middlewareValidationError(error, res);
    const account = await accountControler.create({
      name: value.name,
      type: value.type,
    });
    res.status(201).json(account);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};

const update = async (req, res) => {
  try {
    const {error, value} = Joi.object().keys({
      id: Joi.number().integer(),
      name: Joi.string().required(),
      type: Joi.string().valid(...Object.values(AccountInterface.AccountType)).required(),
    }).validate({...req.body, ...req.query});
    if (error) return middlewareValidationError(error, res);
    const account = await accountControler.update({
      id: value.id,
      name: value.name,
      type: value.type,
    });
    res.status(201).json(account);
  } catch (error) {
    middlewareDefaultError(error, res);
  }
};

const remove = async (req, res) => {
  try {
    const {error, value} = Joi.object().keys({
      id: Joi.number().integer().required(),
    }).validate(req.query);
    if (error) return middlewareValidationError(error, res);
    await accountControler.remove(value.id);
    res.status(201).json({id: value.id});
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
