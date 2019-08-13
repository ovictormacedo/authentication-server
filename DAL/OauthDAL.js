require('dotenv').config();
require("./Conf");
var OauthModel = require("./OauthModel");

exports.authorize = function (oauth) {
    let oauthModel = new OauthModel(oauth);

    return oauthModel.save()
        .then(function (res) {
            return true;
        })
        .catch(function (err) {
            return false;
        });
}

exports.getOauthByUserId = function (id) {
    return OauthModel.find({"userId": id}).
        sort({"expirationToken": -1, "expirationRefreshToken": -1}).
        exec().
        then(function (oauth) {
            return oauth;
        }).
        catch(function (err) {
            return err;
        });
}

exports.getOauthByRefreshToken = function (refreshToken) {
    return OauthModel.find({"refreshToken": refreshToken}).
        sort({"expirationToken": -1, "expirationRefreshToken": -1}).
        exec().
        then(function (oauth) {
            return oauth;
        }).
        catch(function (err) {
            return err;
        });
}