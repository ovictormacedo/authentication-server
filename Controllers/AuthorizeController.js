require('dotenv');
const { validationResult } = require('express-validator');
var crypto = require('crypto');
var oauthDAL = require("../DAL/OauthDAL");
var personDAL = require('../../Person/DAL/PersonDAL');
var uniqid = require('uniqid');

var hash = crypto.createHash('sha512');
var env = process.env;

exports.AuthorizeController = function (req, res) {
    //Retrieves the user by email
    let person = personDAL.getPersonByEmail(req.body.email);

    //Check if the user wasn't found on the database
    if (person == '') {
        return res.send("Not found");
    }

    //Chek if the password is the one passed
    let password = hash.update(req.body.password+env.PASSWORD_SALT, 'utf-8');
    let passwordHashed = password.digest('hex');
    if (person.password != passwordHashed) {
        return res.send("Wrong Password");
    }

    //Search for a valid token for the user
    var oauth = oauthDAL.getOauthByUserId(person.id);
    //If not found, insert a new one
    if (oauth == "") {
        let d = new Date();
        return oauth.oauthDAL({
            userId: person._id,
            token: uniqid(),
            refreshToken: uniqid(),
            expirationToken: new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes()+env.TOKEN_TIME).getTime(),
            expirationRefreshToken: new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes()+env.REFRESH_TOKEN_TIME).getTime()
        })
        .then(function (res) {
            return res.send({
                //Return JWT + Data - TODO
            });
        })
        .catch(function (err) {
            //Handle error
        });
    }

    

}