require('dotenv').config();
var express = require("express"),
    bodyParser = require('body-parser');

var env = process.env;

var AuthValidation = require("./Validation/AuthorizeValidation");
var AuthController = require("./Controllers/AuthorizeController");

var app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

let json = {
    client_id: "a",
    client_secret: "a",
    grant_type: "Password or Refresh Token",
    scope: ["Social"],
    username: "a",
    password: "a"
};

app.post("/oauth/authorize", AuthValidation.AuthorizeValidation, AuthController.AuthorizeController);

var server = app.listen(env.PORT, function () {
    console.log('Oauth Service listening at '+env.PORT);
});