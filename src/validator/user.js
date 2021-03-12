const { param } = require('express-validator');

exports.getUserById = [
    param("user_id").isLength({min:1, max: 50})
];
