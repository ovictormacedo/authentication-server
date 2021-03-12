const { check } = require('express-validator');

exports.authorize = [
    check("grant_type").equals("password"),
    check("username").isLength({min:1, max: 30}),
    check("password").isLength({min:1, max: 20})
];

exports.refreshToken = [
    check("authorization").isLength({min:8})
];

exports.validateToken = [
    check("authorization").isLength({min:8})
];
