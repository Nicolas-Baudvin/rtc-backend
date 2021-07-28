const mongoose = require('mongoose');

async function db() {
    try {
        await mongoose.connect(process.env.MONGO_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
    } catch (e) {
        console.log('erreur : ', e);
    }
}

module.exports = db;
