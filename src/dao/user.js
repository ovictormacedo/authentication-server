const { DataTypes } = require('sequelize');
const log = require('../util/log');
const conf = require('./config');

const userSchema = conf.sequelize.define('user', {
    name: {type: DataTypes.STRING},
    last_name: {type: DataTypes.STRING},
    phone: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    document: {type: DataTypes.STRING},
    document_type: {type: DataTypes.STRING},
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
    deleted_at: { type: DataTypes.DATE },
},{
    tableName: "user",
});

const roleSchema = conf.sequelize.define('role', {
    name: {
        type: DataTypes.STRING
    },
},{
    timestamps: false,
    paranoid: false,
    tableName: "role",
});

const userRoleSchema = conf.sequelize.define('user_role', {
    user_id: {type: DataTypes.INTEGER},
    role_id: {type: DataTypes.INTEGER},
},
{timestamps: false, paranoid: false, tableName: "user_role"});

userSchema.belongsToMany(roleSchema, { through: userRoleSchema });
roleSchema.belongsToMany(userSchema, { through: userRoleSchema });

exports.getUserByEmailAndByPassword = async (email, password) => {
    try {
        return await userSchema.findOne({
            where: {email: email, password: password},
            include: roleSchema,
        });
    } catch (error) {
        log.error(error);
        return null;
    }
}

exports.getUserById = async (user_id) => {
    try {
        return await userSchema.findOne({
            where: {id: user_id},
            include: roleSchema,
        });
    } catch (error) {
        log.error(error);
        return null;
    }    
}

exports.getUserByEmail = async (email) => {
    try {
        return await userSchema.findOne({
            where: {email: email},
            include: roleSchema,
        });
    } catch (error) {
        log.error(error);
        return null;
    }    
}

exports.getUserByPhone = async (phone) => {
    try {
        return await userSchema.findOne({
            where: {phone: phone},
            include: roleSchema,
        });
    } catch (error) {
        log.error(error);
        return null;
    }    
}

exports.signUp = async (user, roleName) => {
    try {
        let role = await roleSchema.findOne({where: {name: roleName}});
        let userAux = await userSchema.create(user);
        await userAux.setRoles(role.id);
        userAux.dataValues.roles = [role.dataValues];
        return userAux;
    } catch (error) {
        log.error(error);
        return null;
    }
}
