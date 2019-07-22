const { check } = require('express-validator');
var mongoose = require('mongoose');

exports.AuthorizeValidation = [
    check("client_id").isLength({min:1}),
    check("client_secret").isLength({min:1}),
    check("grant_type").equals("Password"),
    check("scope").isLength({min:1}),
    check("username").isLength({min:1}),
    check("password").isLength({min:1})
];