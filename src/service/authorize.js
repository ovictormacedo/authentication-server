const crypto = require('crypto');
const userDao = require("../dao/user");
const oauth2Dao = require("../dao/oauth2");

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
    let expirationToken = now.setSeconds(now.getSeconds()+process.env.TOKEN_TIME).getTime();
    now = new Date();
    let expirationRefreshToken = now.setSeconds(now.getSeconds()+process.env.REFRESH_TOKEN_TIME).getTime();
    
    let jwtPayload = {user, "exp":expirationToken};
    let accessToken = jwt.sign(JSON.stringify(jwtPayload), 'secret');
    jwtPayload = {user, "exp":expirationRefreshToken};
    let refreshToken = jwt.sign(JSON.stringify(jwtPayload), 'secret');
    return [accessToken, refreshToken, expirationToken, expirationRefreshToken]
}
