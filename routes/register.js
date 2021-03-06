var express = require('express');
var routes = express.Router();

const registerService = require('./../services/registerService');
const validation = require('../validation/registerValidation');

routes.post('/api/register', validation.register, async (req, res) => {
    try {
        let result = await registerService.register(req);
        console.log(JSON.stringify(result));
        res.json(result)
    } catch (error) {
        res.send(error);
    }
});

module.exports = routes;