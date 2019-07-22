require('dotenv');
require("./Conf");
var OauthModel = require("./OauthModel");
var mongoose = require('mongoose');

exports.Authorize = function (oauth) {
    let oauthModel = new OauthModel(oauth);

    personModel.save(function (err) {
        if (err) return err;
        console.log("Person Saved!")
        return true;
    });
}

exports.getOauthByUserId = function (id) {
    return PersonModel.find({"userId": id})
        .exec()
        .then(function (oauth) {
            return oauth;
        })
        .catch(function (err) {
            return err;
        });
}

exports.getPersonByName = function (name) {
    return PersonModel.find({"name": name})
        .exec()
        .then(function (person) {
            return person;
        })
        .catch(function (err) {
            return err;
        });
}

exports.updatePerson = function (person) {
    return PersonModel.updateOne({"_id": mongoose.Types.ObjectId(person.id)},
        {"name": person.name,
        "lastName": person.lastName,
        "birthDate": person.birthDate,
        "gender": person.gender,
        "bio": person.bio
        })
        .exec()
        .then(function (person) {
            return person;
        })
        .catch(function (err) {
            return err;
        });
}