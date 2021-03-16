const { check, param, header } = require('express-validator');
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
    check("name").isLength({min:1, max: 50}),
    check("last_name").isLength({min:1, max: 50}),
    check("phone").isLength({min:14, max: 15}),
    check("email").isEmail(),
    check("password").isLength({min:1, max: 20}),
];
