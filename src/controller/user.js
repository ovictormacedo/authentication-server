require('dotenv').config();
const { validationResult } = require('express-validator');
const userDao = require("../dao/user");
const log = require("../util/log");

exports.getUserById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log.info(errors)
        res.status(400);
        res.send(errors);
    } else {
        let user = await userDao.getUserById(req.params.user_id);
        if (user) {
            log.info(user)
            res.status(200);
            res.send(user);
        } else {
            log.info("User not found")
            res.status(400);
            res.send("User not found");
        }
    }
}
