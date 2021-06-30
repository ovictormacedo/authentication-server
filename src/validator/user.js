const { param, header, body, oneOf } = require('express-validator');
const service = require("../service/authorize")

exports.getUserById = [
    header("authorization").custom(value => {
        return service.validateToken(value).then(valid => {
            if (!valid)
                return Promise.reject("Token expired");
        });
    }),
    param("user_id").isLength({min:1, max: 50})
];

exports.getUserByEmail = [
    header("authorization").custom(value => {
        return service.validateToken(value).then(valid => {
            if (!valid)
                return Promise.reject("Token expired");
        });
    }),
    param("email").isEmail()
];

exports.getUserByPhone = [
    header("authorization").custom(value => {
        return service.validateToken(value).then(valid => {
            if (!valid)
                return Promise.reject("Token expired");
        });
    }),
    param("phone").isLength({min:14, max: 15})
];

exports.signUp = [
    body("name").isLength({min:1, max: 50}),
    body("phone").isLength({min:10, max: 15}),
    body("email").isEmail(),
    body("password").isLength({min:1, max: 10}),
    oneOf([
        body("role").equals("tenant"),
        body("role").equals("realtor"),
        body("role").equals("proprietary"),
    ]),
    body("document").isLength({min:14, max: 15}),
    body("document_type").isString(),
];
