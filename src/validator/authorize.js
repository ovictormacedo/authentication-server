const { header, body } = require('express-validator');

exports.authorize = [
    header("grant_type").equals("password"),
    body("username").isLength({min:1, max: 30}),
    body("password").isLength({min:1, max: 20})
];

exports.refreshToken = [
    header("grant_type").equals("refresh"),
    header("authorization").isLength({min:8})
];

exports.validateToken = [
    header("authorization").isLength({min:8})
];
