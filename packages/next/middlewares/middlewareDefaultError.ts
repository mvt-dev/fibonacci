const middlewareDefaultError = (error, res) => {
  console.error(error);
  res.status(400).json({
    code: 400,
    message: 'Internal server error'
  });
};

export default middlewareDefaultError;
