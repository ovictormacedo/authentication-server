const { DataTypes } = require('sequelize');
const log = require('../util/log');
const conf = require('./config');

const userSchema = conf.sequelize.define('user', {
    name: {
        type: DataTypes.STRING
    },
    last_name: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
    deleted_at: { type: DataTypes.DATE },
},{
    tableName: "user",
});

exports.getUserByEmailAndByPassword = async (email, password) => {
    try {
        return await userSchema.findOne({
            where: {email: email, password: password}
        });
    } catch (error) {
        log.error(error);
        return null;
    }
}

exports.getUserById = async (user_id) => {
    try {
        return await userSchema.findOne({
            where: {id: user_id}
        });
    } catch (error) {
        log.error(error);
        return null;
    }    
}

exports.getUserByEmail = async (email) => {
    try {
        return await userSchema.findOne({
            where: {email: email}
        });
    } catch (error) {
        log.error(error);
        return null;
    }    
}

exports.getUserByPhone = async (phone) => {
    try {
        return await userSchema.findOne({
            where: {phone: phone}
        });
    } catch (error) {
        log.error(error);
        return null;
    }    
}

exports.signUp = async (user) => {
    try {
        return await userSchema.create(user);
    } catch (error) {
        log.error(error);
        return null;
    }
}
