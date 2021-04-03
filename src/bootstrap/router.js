let authValidator = require("../validator/authorize");
let authController = require("../controller/authorize");

let userValidator = require("../validator/user");
let userController = require("../controller/user");

BASE_ROUTE = "/api/authentication"

exports.router = app => {
    app.post(
        `${BASE_ROUTE}/oauth/authorize`,
        authValidator.authorize,
        authController.authorize
    );

    app.post(
        `${BASE_ROUTE}/oauth/refresh`,
        authValidator.refreshToken,
        authController.refreshToken
    );

    app.post(
        `${BASE_ROUTE}/oauth/validate`,
        authValidator.validateToken,
        authController.validateToken
    );
    
    app.get(
        `${BASE_ROUTE}/user/id/:user_id`,
        userValidator.getUserById,
        userController.getUserById
    );

    app.get(
        `${BASE_ROUTE}/user/email/:email`,
        userValidator.getUserByEmail,
        userController.getUserByEmail
    );

    app.get(
        `${BASE_ROUTE}/user/phone/:phone`,
        userValidator.getUserByPhone,
        userController.getUserByPhone
    );

    app.post(
        `${BASE_ROUTE}/user/signup`,
        userValidator.signUp,
        userController.signUp
    );
}