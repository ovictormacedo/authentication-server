require('dotenv').config();
const express = require("express");
const log = require("./util/log");
const http = require('http');

let authValidator = require("./validator/authorize");
let authController = require("./controller/authorize");

let userValidator = require("./validator/user");
let userController = require("./controller/user");

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/oauth/authorize", authValidator.authorize, authController.authorize);
app.post("/oauth/refresh", authValidator.refreshToken, authValidator.refreshToken);
app.post("/oauth/validate", authValidator.validateToken, authValidator.validateToken);

app.get("/user/id/:user_id", userValidator.getUserById, userController.getUserById);

http.createServer({}, app).listen(process.env.PORT, function(){
    log.info('Oauth 2 Service listening at '+process.env.PORT);
});
