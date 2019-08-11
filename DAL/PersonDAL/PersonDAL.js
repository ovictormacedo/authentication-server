require("./Conf");

var PersonModel = require("./PersonModel");

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