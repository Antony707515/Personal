const setRequestType = (req, res, next) => {
  req.requestType = req.params.type;
  next();
};

const errorHandler = (error, req, res, next) => {
  console.log('**************************************');
  console.log('The error occured', error);
  console.log('The request details', {
    body: req.body,
    url: req.originalUrl,
    query: req.query,
    params: req.params,
    time: new Date(),
  });
  console.log('-----------------------------------------\n\n');
  res.status(200).send({ success: false, message: 'Error occured while processing' });
};

module.exports = {
  setRequestType,
  errorHandler,
};
