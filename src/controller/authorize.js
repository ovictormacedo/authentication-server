require('dotenv').config();
const { validationResult } = require('express-validator');
const oauth2Dao = require("../dao/oauth2");
const userDao = require("../dao/user");
const service = require("../service/authorize")
const log = require("../util/log");

exports.authorize = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log.info(errors)
        res.status(400);
        res.send(errors);
    } else {
        let user = await service.signIn(req.body.username, req.body.password)

        if (!user) {
            log.info("User not found: "+req.body.username)
            res.status(401);
            return res.send("User not found or wrong Password");
        }

        let oauth = await oauth2Dao.getOauthByUserId(user.id);
        if (!oauth) {
            log.info("Generating first access token and refresh token for user: "+user.id)
            let authResponse = await service.authorize(user)
            authResponse.dataValues.id = undefined;
            res.status(200);
            return res.send(authResponse.dataValues);
        } else {
            let now = Date.now();
            oauth.dataValues.id = undefined;
            if (now < oauth.dataValues.expiration_token || 
                now < oauth.dataValues.expiration_refresh_token) {
                log.info("Token or refresh token still valid")
                res.status(200);
                return res.send(oauth.dataValues)
            } else {
                log.info("Generating new access token and refresh token for user: "+user.id)
                let authResponse = await service.authorize(user)
                authResponse.dataValues.id = undefined;
                res.status(200);
                return res.send(authResponse.dataValues);
            }
        }
    }
}

exports.refreshToken = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log.info(errors)
        res.send("Wrong parameters!");
    } else {
        let authorization = req.headers.authorization;
        let refreshToken = authorization.substring(7, authorization.length);

        let oauth = await oauth2Dao.getOauthByRefreshToken(refreshToken);      

        if (!oauth) {
            log.info("Refresh token expired")
            res.status(401);
            return res.send("Refresh token expired");
        } else {
            let now = new Date().getTime();

            if (now < oauth.expiration_token) {
                oauth.dataValues.id = undefined;
                res.status(200);
                return res.send(oauth);  
            } else if (now < oauth.expiration_refresh_token) {
                let user = await userDao.getUserById(oauth.user_id);
                user.password = undefined;
                let tokens = service.generateTokens(user)
                log.info("Refreshing token")
                oauth = await oauth2Dao.authorize({
                    user_id: user.id,
                    access_token: tokens[0],
                    refresh_token: tokens[1],
                    expiration_token: tokens[2],
                    expiration_refresh_token: tokens[3]
                });
                oauth.dataValues.id = undefined;
                res.status(200);
                return res.send(oauth);  
            } else {
                log.info("Refresh token expired")
                res.status(401);
                return res.send("Refresh token expired");
            }
        }
    }
}
