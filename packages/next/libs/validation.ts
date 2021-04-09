import Joi from 'joi';

const validation = Joi;

const isValid = (obj: any, schema: any) => {
  const { error, value } = validation.object().keys(schema).validate(obj);
  return {
    error,
    ...value
  }
}

export {
  validation,
  isValid,
};
