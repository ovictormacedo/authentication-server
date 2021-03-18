require('dotenv').config();
const { validationResult } = require('express-validator');
const userDao = require("../dao/user");
const log = require("../util/log");
const crypto = require('crypto');

exports.getUserById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log.info(errors)
        res.status(400);
        res.send(errors);
    } else {
        let user = await userDao.getUserById(req.params.user_id);
        if (user) {
            user.password = undefined;
            log.info(user)
            res.status(200);
            res.send(user);
        } else {
            log.info("User not found")
            res.status(200);
            res.send("User not found");
        }
    }
}

exports.getUserByEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log.info(errors)
        res.status(400);
        res.send(errors);
    } else {
        let user = await userDao.getUserByEmail(req.params.email);
        if (user) {
            user.password = undefined;
            log.info(user)
            res.status(200);
            res.send(user);
        } else {
            log.info("User not found")
            res.status(200);
            res.send("User not found");
        }
    }
}

exports.getUserByPhone = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log.info(errors)
        res.status(400);
        res.send(errors);
    } else {
        let user = await userDao.getUserByPhone(req.params.phone);
        if (user) {
            user.password = undefined;
            log.info(user)
            res.status(200);
            res.send(user);
        } else {
            log.info("User not found")
            res.status(200);
            res.send("User not found");
        }
    }
}

exports.signUp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log.info(errors)
        res.status(400);
        res.send(errors);
    } else {
        let hash = crypto.createHash('sha512');
        let passwordTemp = hash.update(req.body.password+process.env.PASSWORD_SALT, 'utf-8');
        let passwordHashed = passwordTemp.digest('hex');

        let user = await userDao.getUserByEmail(req.body.email);

        if (user != null) {
            log.info(user)
            log.info("Email already used")
            res.status(400);
            return res.send("Email already used");
        }

        user = await userDao.signUp({
            name: req.body.name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            email: req.body.email,
            password: passwordHashed,
        });

        if (user) {
            user.password = undefined
            log.info("Sign up user: "+user)
            res.status(200);
            res.send(user);
        } else {
            log.info("It was not able to sign up user")
            res.status(500);
            res.send("It was not able to sign up user");
        }
    }
}