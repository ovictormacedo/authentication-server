let authValidator = require("../validator/authorize");
let authController = require("../controller/authorize");

let userValidator = require("../validator/user");
let userController = require("../controller/user");

exports.router = app => {
    app.post(
        "/oauth/authorize",
        authValidator.authorize,
        authController.authorize
    );

    app.post(
        "/oauth/refresh",
        authValidator.refreshToken,
        authController.refreshToken
    );

    app.post(
        "/oauth/validate",
        authValidator.validateToken,
        authController.validateToken
    );
    
    app.get(
        "/user/id/:user_id",
        userValidator.getUserById,
        userController.getUserById
    );

    app.get(
        "/user/email/:email",
        userValidator.getUserByEmail,
        userController.getUserByEmail
    );

    app.get(
        "/user/phone/:phone",
        userValidator.getUserByPhone,
        userController.getUserByPhone
    );

    app.post(
        "/user/signup",
        userValidator.signUp,
        userController.signUp
    );
}