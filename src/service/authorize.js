require('dotenv').config();
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const userDao = require("../dao/user");
const oauth2Dao = require("../dao/oauth2");
const log = require("../util/log");
const time = require("../service/time");

exports.signIn = async (email, password) => {
    let hash = crypto.createHash('sha512');
    let passwordTemp = hash.update(password+process.env.PASSWORD_SALT, 'utf-8');
    let passwordHashed = passwordTemp.digest('hex');

    let user = await userDao.getUserByEmailAndByPassword(
        email,
        passwordHashed
    );
    
    if (user)
        user.password = undefined;
    
    return user;
}

exports.authorize = async (user) => {
    let tokens = this.generateTokens(user)

    return await oauth2Dao.authorize({
        user_id: user.id,
        access_token: tokens[0],
        refresh_token: tokens[1],
        expiration_token: tokens[2],
        expiration_refresh_token: tokens[3]
    });
}

exports.generateTokens = (user) => {
    let now = new Date();
    let expirationToken = now.setSeconds(parseInt(now.getSeconds())+parseInt(process.env.TOKEN_TIME));

    now = new Date();
    let expirationRefreshToken = now.setSeconds(parseInt(now.getSeconds())+parseInt(process.env.REFRESH_TOKEN_TIME));

    let jwtPayload = {user, "exp":expirationToken};
    let accessToken = jwt.sign(JSON.stringify(jwtPayload), process.env.OAUTH2_SECRET);
    jwtPayload = {user, "exp":expirationRefreshToken};
    let refreshToken = jwt.sign(JSON.stringify(jwtPayload), process.env.OAUTH2_SECRET);
    return [accessToken, refreshToken, expirationToken, expirationRefreshToken]
}

exports.validateToken = async (authorization) => {
    let accessToken = authorization.substring(7, authorization.length);
    let now = time.getTimestampNow();
    let decodedToken = null;
    try {
        decodedToken = jwt.verify(accessToken, process.env.OAUTH2_SECRET)
    } catch (error) {
        log.info("Access token expired")
        return false;
    }

    if (now < decodedToken.exp) {
        log.info("Valid token")
        return true;
    }

    log.info("Access token expired")
    return false;
}