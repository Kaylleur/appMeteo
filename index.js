var express = require('express');
var path = require('path');
var swig = require('swig');
var bodyParser = require('body-parser');
var config = require('./config');
var app = express();

var apiKey = config.apiKey;

if (apiKey === null) {
    console.error("[ERR] Please provide an api key in the config file.");
    process.exit();
}

var weather = require('./factories/weatherFactory')(apiKey);

var weatherRouter = require('./routes/weather')(weather);

// Express configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use('/', weatherRouter);

var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
