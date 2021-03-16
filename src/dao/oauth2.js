const { DataTypes } = require('sequelize');
const log = require('../util/log');
const conf = require('./config');

const oauth2Schema = conf.sequelize.define('oauth2', {
    user_id: {
        type: DataTypes.INTEGER
    },
    access_token: {
        type: DataTypes.STRING
    },
    refresh_token: {
        type: DataTypes.STRING
    },
    expiration_token: {
        type: DataTypes.INTEGER
    },
    expiration_refresh_token: {
        type: DataTypes.INTEGER
    },
},{
    timestamps: false,
    tableName: "oauth2",
});

exports.authorize = async (oauth) => {
    try {
        return await oauth2Schema.create(oauth);
    } catch (error) {
        log.error(error);
        return null;
    }
}

exports.getOauthByUserId = async (userId) => {
    try {
        return await oauth2Schema.findOne({
            where: {user_id: userId},
            order: [
                ["expiration_token", "DESC"],
                ["expiration_refresh_token", "DESC"],
            ]
        })
    } catch (error) {
        log.error(error);
        return null;
    }
}

exports.getOauthByRefreshToken = async (refreshToken) => {
    try {
        return await oauth2Schema.findOne({
            where: {refresh_token: refreshToken},
            order: [
                ["expiration_token", "DESC"],
                ["expiration_refresh_token", "DESC"],
            ]
        })
    } catch (error) {
        log.error(error);
        return null;
    }
}

exports.getOauthByAccessToken = async (accessToken) => {
    try {
        return await oauth2Schema.findOne({
            where: {access_token: accessToken},
            order: [
                ["expiration_token", "DESC"],
                ["expiration_refresh_token", "DESC"],
            ]
        })
    } catch (error) {
        log.error(error);
        return null;
    }
}