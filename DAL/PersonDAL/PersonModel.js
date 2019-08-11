var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PersonSchema = new Schema({
    name: String,
    lastName: String,
    birthDate: Date,
    gender: String,
    email: String,
    password: String,
    picture: String,
    otherPictures: [String],
    bio: String,
    friends: [String]
}, { collection: 'person' });

var Person = mongoose.model('person', PersonSchema);

module.exports = Person;