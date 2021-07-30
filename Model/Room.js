const mongoose = require('mongoose');
const Message = require('./Message');

const RoomSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        owner: { type: Object, required: true },
        members: { type: Array, required: true },
        messages: { type: Array, required: true },
    },
    { timestamps: true }
);

const RoomModel = mongoose.model('Room', RoomSchema);

module.exports = RoomModel;
