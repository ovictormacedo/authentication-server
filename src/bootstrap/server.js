require('dotenv').config();
const log = require('../util/log');
const http = require('http');
const setTZ = require('set-tz')
setTZ('UTC')

exports.webServer = (app) => {
    http.createServer({}, app).listen(process.env.PORT, function(){
        log.info("Oauth 2/User API listening on port " + process.env.PORT);
    });
}