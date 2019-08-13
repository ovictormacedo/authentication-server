require('dotenv').config();
require("./Conf");
var PersonModel = require("./PersonModel");
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

exports.getPersonByEmail = function (email) {
    return PersonModel.findOne({"email": email})
        .exec()
        .then(function (person) {
            return person;
        })
        .catch(function (err) {
            return err;
        });
}

exports.getPersonById = function (id) {
    console.log(mongoose.Types.ObjectId(id));
    console.log(new ObjectId(id));
    return PersonModel.findById(id)
        .exec()
        .then(function (person) {
            return person;
        })
        .catch(function (err) {
            return err;
        });
}