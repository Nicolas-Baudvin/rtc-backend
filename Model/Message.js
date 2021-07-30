const mongoose = require('mongoose');
const Room = require('./Room');

const MessageSchema = new mongoose.Schema(
    {
        desc: { type: String, required: true },
        author: { type: String, required: true },
        authorPicture: { type: String, required: true },
        roomId: { type: String, required: true },
    },
    { timestamps: true }
);

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
