var Joi = require('joi');

let fetchUserDetails = async function (req, res, next) {
    let parameters = req.params;

    const sort = Joi.object().keys({
        by: Joi.string().trim().allow('').regex(/^[a-zA-Z0-9\s]+$/).max(30),
        type: Joi.string().valid("asc", "desc", "").allow('')
    });

    const filters = Joi.object().keys({
        by: Joi.string().trim().allow('').regex(/^[a-zA-Z0-9\s]+$/).max(30),
        value: [Joi.number().empty(''), Joi.string().trim().allow('').regex(/^[a-zA-Z0-9\-/\\:\\._\s]+$/).max(100)
        .error(new Error('Please enter valid string or number')), 
        Joi.array().items(Joi.string())]
       
    });

    const schema = Joi.object({
        sort: sort,
        filters: Joi.array().items(filters)
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
    const schemaParams = Joi.object().keys({
        pageNumber: Joi.number(),
        pageSize: Joi.number()
    });
    const paramvalidation = schemaParams.validate(parameters, {
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
    req.params = paramvalidation.value;
    let err = {
        "status": 400,
        "statusText": "Bad Request",
        "errors": []
    }
    if (error && error.details) {
        err["errors"] = error.details
    }

    if (paramvalidation.error != null && paramvalidation.error.details) {
        for (let details of paramvalidation.error.details) {
            err["errors"].push(details)
        }
    }

    if (err.errors.length > 0) {
        console.error("Validation Error fetchUserDetails");
        res.send(err);
    }
    else {
        next();
    }
}

module.exports.fetchUserDetails = fetchUserDetails;