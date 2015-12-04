var request = require('request');
var _ = require('lodash');

module.exports = function(apiKey) {
    var query = function(uri, callback) {
        request(uri, function (error, response, body) {
            return callback(error, JSON.parse(body));
        });
    };

    var getWeather = function(city, callback) {
        var uri = "http://api.openweathermap.org/data/2.5/weather?APPID="+apiKey+"&units=metric&q=" + city;
        query(uri, callback);
    };

    var getForecast = function(city, callback) {
        var uri = "http://api.openweathermap.org/data/2.5/forecast?appid="+apiKey+"&units=metric&q=" + city;
        query(uri, callback);
    };

    var index = function(req, res) {
        res.render('index.html', {});
    };

    var previsions = function(req, res) {
        var city = req.body.city;
        getForecast(city, function(err, previsions) {
            if (err) {
                return res.sendStatus(500);
            }

            //
            var cacheDate;
            _.forEach(previsions.list, function(n, key) {
                var cur = n.dt_txt.substr(0, 10);
                n.increment = false;
                if (cacheDate !== cur) {
                    n.increment = true;
                }
                cacheDate = cur;

                n.date = cur;
                n.time = n.dt_txt.substr(11, 19);
            });

            var result = {
                'previsions': previsions
            };
            res.render('index.html', result);
        });
    };

    return {
        'index': index,
        'previsions': previsions
    };
};
