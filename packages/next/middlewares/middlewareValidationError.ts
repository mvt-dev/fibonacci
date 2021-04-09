const middlewareValidationError = (error, res) => {
  console.warn(error);
  res.status(422).json({
    code: 422,
    message: error.details[0].message,
    fields: error.details[0].path
  });
};

export default middlewareValidationError;
