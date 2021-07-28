const fastify = require('fastify');
const cors = require("fastify-cors");
const socketIo = require("fastify-socket.io");
const jwtPlugin = require('./Plugin/jwtPlugin');
const userRoutes = require('./Router/UserRoutes');
const mongoose = require('mongoose');
require("dotenv").config();


function build(opts = {}) {
    const app = fastify({ logger: true, ...opts });

    app.register(cors, {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    });

    app.register(socketIo, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            "credentials": true
        }
    }).then(() => {
        app.io.on("connection", (socket) => {
            console.info("socket connected");
            socket.on("login", (data) => {
                console.log("login", data);
            });
        });
    });

    app.register(jwtPlugin).after(err => { if (err) throw err });
    app.register(userRoutes);

    return app;
}

module.exports = build;