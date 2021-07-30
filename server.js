const db = require('./Util/Db');
const server = require('./app')({
    logger: {
        level: 'info',
        prettyPrint: true,
    },
});

db().then(() => {
    console.log('connected to databse');
});

server.listen(5000, (err, address) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
});
