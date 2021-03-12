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
            log.info("Authorizing user: "+user.id)
            let authResponse = await service.authorize(user)
            res.status(200);
            return res.send(authResponse);
        } else {
            let now = new Date().getTime();

            if (now < oauth.expiration_token || now < oauth.expiration_refresh_token) {
                res.status(200);
                return res.send({
                    user: user,
                    access_token: oauth.access_token,
                    refresh_token: oauth.refreshToken,
                    expiration_token: oauth.expiration_token,
                    expiration_refresh_token: oauth.expiration_refresh_token                        
                });   
            } else {
                let authResponse = await service.authorize(user)
                res.status(200);
                return res.send(authResponse);
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

            if (now < oauth.expiration_refresh_token) {
                let user = await userDao.getUserById(oauth.user_id);
                user.password = undefined;
                let tokens = service.generateTokens(user)
                log.info("Refreshing token")
                let oauth = await oauth2Dao.authorize({
                    user_id: user.id,
                    access_token: tokens[0],
                    refresh_token: tokens[1],
                    expiration_token: tokens[2],
                    expiration_refresh_token: tokens[3]
                });
                res.status(200);
                return res.send({
                    user: user,
                    access_token: oauth.access_token,
                    refresh_token: oauth.refresh_token,
                    expiration_token: oauth.expiration_token,
                    expiration_refresh_token: oauth.expiration_refresh_token                        
                });  
            } else {
                log.info("Refresh token expired")
                res.status(401);
                return res.send("Refresh token expired");
            }
        }
    }
}

exports.validateToken = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        log.info(errors)
        res.send("Wrong parameters!");
    } else {
        let authorization = req.headers.authorization;
        let accessToken = authorization.substring(7, authorization.length);

        let oauth = await oauth2Dao.getOauthByAccessToken(accessToken);      

        if (!oauth) {
            log.info("Access token expired")
            res.status(401);
            return res.send("Access token expired");
        } else {
            let now = new Date().getTime();

            if (now < oauth.expiration_token) {
                log.info("Valid token")
                res.status(200);
                return res.send("Valid token");
            } else {
                log.info("Access token expired")
                res.status(401);
                return res.send("Access token expired");
            }
        }
    }
}