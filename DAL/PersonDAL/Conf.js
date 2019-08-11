require('dotenv').config();
var mongoose = require('mongoose');

var mongoDB = 'mongodb://localhost:27017/'+process.env.DATABASE_NAME;
mongoose.connect(mongoDB, { useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db