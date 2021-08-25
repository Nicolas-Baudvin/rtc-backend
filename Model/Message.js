const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        desc: { type: String, required: true },
        author: { type: String, required: true },
        authorPicture: { type: String, required: false },
        roomId: { type: String, required: true },
    },
    { timestamps: true }
);

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
