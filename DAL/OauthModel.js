var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OauthSchema = new Schema({
    userId: String,
    accessToken: String,
    refreshToken: String,
    expirationToken: Number,
    expirationRefreshToken: Number
}, { collection: 'oauth' });

var Oauth = mongoose.model('Oauth', OauthSchema);

module.exports = Oauth;