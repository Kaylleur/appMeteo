var express = require('express');
var router = express.Router();

module.exports = function(weatherApi) {
    router.get('/', weatherApi.index);
    router.post('/', weatherApi.previsions);
    return router;
};
