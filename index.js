const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes');
routes(app);

const server = app.listen(port);

console.log('Server listening on port ' + port);
