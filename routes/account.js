var express = require('express');
var routes = express.Router();

const accountService = require('./../services/accountService');
const validation = require('../validation/accountValidation');


routes.post('/api/users/:pageSize/:pageNumber', validation.fetchUserDetails,async (req, res) => {
    try {
        
        let result = await accountService.userList(req);
        console.log(JSON.stringify(result));
        res.json(result);
        
    } catch (error) {
        res.send(error);
    }
});

module.exports= routes;