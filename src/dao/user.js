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
},{
    timestamps: false,
    tableName: "user",
});

exports.getUserByEmailAndByPassword = async (email, password) => {
    try {
        return await userSchema.findOne({
            where: {email: email, password: password}
        });
    } catch (error) {
        log.error(error);
        return false;
    }
}

exports.getUserById = async (user_id) => {
    try {
        return await userSchema.findOne({
            where: {id: user_id}
        });
    } catch (error) {
        log.error(error);
        return false;
    }    
}