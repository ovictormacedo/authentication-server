require('dotenv').config();
const { validationResult } = require('express-validator'),
    crypto = require('crypto'),
    oauthDAL = require("../DAL/OauthDAL"),
    personDAL = require("../DAL/PersonDAL/PersonDAL"),
    jwt = require("jsonwebtoken");

var env = process.env;

exports.authorizeController = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.send("Wrong parameters!");
    } else {
        //Retrieves the user by email
        let person = personDAL.getPersonByEmail(req.body.username);

        person.then(function (person) {
            console.log(person);
            //Check if the user wasn't found on the database
            if (person == null) {
                res.status(401);
                return res.send("User not found");
            }

            //Chek if the password is the one passed
            var hash = crypto.createHash('sha512');
            let password = hash.update(req.body.password+env.PASSWORD_SALT, 'utf-8');
            let passwordHashed = password.digest('hex');

            if (passwordHashed != person.password) {
                res.status(401);
                return res.send("Wrong Password");
            }

            //Removes certain filed that should not be send 
            person.password = undefined;
            person.__v = undefined;

            //Search for a valid token for the user
            var oauthPromisse = oauthDAL.getOauthByUserId(person._id);      

            oauthPromisse.then(function (oauth) {
                //If not found, insert a new one
                if (oauth == "") {
                    let d = new Date();
                    let expirationToken = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds()+env.TOKEN_TIME).getTime();
                    let expirationRefreshToken = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds()+env.REFRESH_TOKEN_TIME).getTime();
                    let personAux = {person, "exp":expirationToken};
                    let accessToken = jwt.sign(JSON.stringify(personAux), 'secret');
                    personAux = {person, "exp":expirationRefreshToken};
                    let refreshToken = jwt.sign(JSON.stringify(personAux), 'secret');

                    return oauthDAL.authorize({
                        userId: person._id,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        expirationToken: expirationToken,
                        expirationRefreshToken: expirationRefreshToken
                    })
                    .then(function (response) {
                        return res.send({
                            person: person,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            expirationToken: expirationToken,
                            expirationRefreshToken: expirationRefreshToken                       
                        });
                    })
                    .catch(function (err) {
                        res.status(500);
                        return res.send("Internal error");
                    });
                } else {
                    let d = new Date();
                    let now = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds()).getTime();
                    let oauthCurrent = oauth[0];
                    //The access token is still valid
                    if (now < oauthCurrent.expirationToken) {
                        return res.send({
                            person: person,
                            accessToken: oauthCurrent.accessToken,
                            refreshToken: oauthCurrent.refreshToken,
                            expirationToken: oauthCurrent.expirationToken,
                            expirationRefreshToken: oauthCurrent.expirationRefreshToken                        
                        });                    
                    } else if (now < oauthCurrent.expirationRefreshToken) {
                        return res.send({
                            person: person,
                            accessToken: oauthCurrent.accessToken,
                            refreshToken: oauthCurrent.refreshToken,
                            expirationToken: oauthCurrent.expirationToken,
                            expirationRefreshToken: oauthCurrent.expirationRefreshToken                        
                        });                         
                    } else {
                        let d = new Date();
                        let expirationToken = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds()+env.TOKEN_TIME).getTime();
                        let expirationRefreshToken = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds()+env.REFRESH_TOKEN_TIME).getTime();
                        let personAux = {person, "exp":expirationToken};
                        let accessToken = jwt.sign(JSON.stringify(personAux), 'secret');
                        personAux = {person, "exp":expirationRefreshToken};
                        let refreshToken = jwt.sign(JSON.stringify(personAux), 'secret');    
    
                        return oauthDAL.authorize({
                            userId: person._id,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            expirationToken: expirationToken,
                            expirationRefreshToken: expirationRefreshToken
                        })
                        .then(function (response) {
                            return res.send({
                                person: person,
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                                expirationToken: expirationToken,
                                expirationRefreshToken: expirationRefreshToken                       
                            });
                        })
                        .catch(function (err) {
                            res.status(500);
                            return res.send("Internal error");
                        });
                    }
                }
            });
        });
    }
}

exports.refreshController = function (req, res) {
    console.log();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.send("Wrong parameters!");
    } else {
        let authorization = req.headers.authorization;
        let refreshToken = authorization.substring(7, authorization.length);

        //Search for a valid token for the user
        var oauthPromisse = oauthDAL.getOauthByRefreshToken(refreshToken);      

        oauthPromisse.then(function (oauth) {
            //If not found, insert a new one
            if (oauth == "") {
                res.status(401);
                return res.send("Refresh token expired");
            } else {
                let d = new Date();
                let now = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds()).getTime();
                oauth = oauth[0];
                //The refresh token is still valid
                if (now < oauth.expirationRefreshToken) {
                    //Retrieve person 
                    let personPromisse = personDAL.getPersonById(oauth.userId);
                    personPromisse.then(function (person) {
                        //Removes certain filed that should not be send 
                        person.password = undefined;
                        person.__v = undefined;
                        
                        let d = new Date();
                        let expirationToken = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes()+env.TOKEN_TIME).getTime();
                        let expirationRefreshToken = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes()+env.REFRESH_TOKEN_TIME).getTime();
                        let personAux = {person, "exp":expirationToken};
                        let accessToken = jwt.sign(JSON.stringify(personAux), 'secret');
                        personAux = {person, "exp":expirationRefreshToken};
                        let refreshToken = jwt.sign(JSON.stringify(personAux), 'secret');    

                        return oauthDAL.authorize({
                            userId: oauth._id,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            expirationToken: expirationToken,
                            expirationRefreshToken: expirationRefreshToken
                        })
                        .then(function (response) {
                            return res.send({
                                person: person,
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                                expirationToken: expirationToken,
                                expirationRefreshToken: expirationRefreshToken                       
                            });
                        })
                        .catch(function (err) {
                            res.status(500);
                            return res.send("Internal error");
                        });      
                    });                
                } else {
                    res.status(401);
                    return res.send("Refresh token expired");
                }

            }
        });
    }
}