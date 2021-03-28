import Joi from 'joi';
import {AccountController} from '@fibonacci/services';

const accountControler = new AccountController();

const defaultError = (error, res) => res.status(400).json({error});

const list = async (_req, res) => {
  try {
    const accounts = await accountControler.list();
    res.status(200).json(accounts);
  } catch (error) {
    defaultError(error, res);
  }
}

const get = async (req, res) => {
  try {
    const { error, value: query } = Joi.object().keys({
      id: Joi.number().integer().required()
    }).validate(req.query);
    if (error) {
      console.warn(error);
      return res.status(422).json(error);
    }
    const accounts = await accountControler.get(query.id);
    res.status(200).json(accounts);
  } catch (error) {
    defaultError(error, res);
  }
}

export default (req, res) => {
  if (req.method === 'GET' && req.query.id) get(req, res);
  else if (req.method === 'GET') list(req, res);
  else res.status(404);
}
