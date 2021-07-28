const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    socketID: { type: String, required: false },
    picture: { type: String, required: false }
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;