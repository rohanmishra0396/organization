var Joi = require('joi');

let login = async function (req, res, next) {

    const schema = Joi.object({
        email: Joi.string().email().required().max(255),
        password: Joi.string().trim().required().max(255)
    }).required();
    const {
        value,
        error
    } = schema.validate(req.body, {
        abortEarly: false,
        language: {
            key: '{{key}} ',
            string: {
                regex: {
                    base: '- {{!value}} , Invalid Format'
                }
            }
        }

    });
    req.body = value;

    let err = {
        "status": 400,
        "statusText": "Bad Request",
        "errors": []
    }
    if (error && error.details) {
        err["errors"] = error.details
    }

    if (err.errors.length > 0) {
        console.error("Validation Error login");
        res.send(err);
    }
    else {
        next();
    }
}

module.exports.login = login;