var express = require('express');
var routes = express.Router();

const loginService = require('./../services/loginService');
const validation = require('../validation/loginValidation');

routes.post("/api/login", validation.login, async function (req, res) {
    try {
        console.log(JSON.stringify(req.body));
        let login = await loginService.login(req);
        res.send(login);
    } catch (error) {
        res.send(error);
    }
});

module.exports = routes;