require('dotenv').config();
const { validationResult } = require('express-validator');
const userDao = require("../dao/user");
const log = require("../util/log");
const crypto = require('crypto');
const { BadRequestResult } = require("../util/errorMessages")

exports.getUserById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log.info("getUserById: Validation error")
        res.status(400);
        res.send(errors);
    } else {
        let user = await userDao.getUserById(req.params.user_id);
        if (user) {
            user.password = undefined;
            log.info("getUserById: Success")
            res.status(200);
            res.send(user);
        } else {
            log.info("getUserById: User not found")
            res.status(400);
            res.send(BadRequestResult("User not found", "user_id"));
        }
    }
}

exports.getUserByEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log.info("getUserByEmail: Validation error")
        res.status(400);
        res.send(errors);
    } else {
        let user = await userDao.getUserByEmail(req.params.email);
        if (user) {
            user.password = undefined;
            log.info("getUserByEmail: Success")
            res.status(200);
            res.send(user);
        } else {
            log.info("getUserByEmail: User not found")
            res.status(400);
            res.send(BadRequestResult("User not found", "email"));
        }
    }
}

exports.getUserByPhone = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log.info("getUserByPhone: getUserByPhone")
        res.status(400);
        res.send(errors);
    } else {
        let user = await userDao.getUserByPhone(req.params.phone);
        if (user) {
            user.password = undefined;
            log.info("getUserByPhone: Success")
            res.status(200);
            res.send(user);
        } else {
            log.info("getUserByPhone: User not found")
            res.status(400);
            res.send(BadRequestResult("User not found", "phone"));
        }
    }
}

exports.signUp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log.info("signUp: Validation error")
        res.status(400);
        res.send(errors);
    } else {
        let hash = crypto.createHash('sha512');
        let passwordTemp = hash.update(req.body.password+process.env.PASSWORD_SALT, 'utf-8');
        let passwordHashed = passwordTemp.digest('hex');

        let user = await userDao.getUserByEmail(req.body.email);

        if (user != null) {
            log.info("signUp: Success")
            log.info("Email already used")
            res.status(400);
            return res.send(BadRequestResult("Email already used", "email"));
        }

        user = await userDao.signUp({
            name: req.body.name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            email: req.body.email,
            document: req.body.document,
            document_type: req.body.document_type,
            password: passwordHashed,
        }, req.body.role);

        if (user) {
            user.password = undefined
            log.info("signUp: Success")
            res.status(200);
            res.send(user);
        } else {
            log.info("signUp: It was not able to sign up user")
            res.status(500);
            res.send("It was not able to sign up user");
        }
    }
}