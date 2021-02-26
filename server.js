var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
/*
* DB Config file based on ENV triggered from pm2
*/
if (process.env.NODE_ENV === "PROD") {
    require('custom-env').env('PROD-config');
} else {
    require('custom-env').env('DEV-config');
}

const passport = require('passport');
require('./libs/passport')(passport);
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

var routes = require('./routes/index');
app.use(routes);

//to handle global error 
app.use((error, req, res, next) => {
    if(error.name === "AuthenticationError"){
        return res.send({
            "status": 401,
            "error": "Authentication Error"
        });
    }

    res.send(error);
    
    
})

app.listen(3001,function(){
    console.log("Server is running");
});