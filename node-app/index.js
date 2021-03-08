const express = require('express');
const bodyParser = require('body-parser');
const get = require('lodash.get');

const routes = require('./routes');
const config = require('./config.json');
const { errorHandler } = require('./middleware');

const app = express();
app.use(bodyParser.json({ type: 'application/json' }));
app.use('/api', routes);
app.use(errorHandler);

app.listen(get(config, 'port', 5000), () => {
  console.log('The application running in port', get(config, 'port', 5000));
});
