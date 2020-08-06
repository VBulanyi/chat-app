require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {};

const socketToRoom = {};

io.on("connection", socket => {
    socket.on("join", (room, name) => {

        const id = socket.id

        socket.join(room)

        if (users[room]) {

            users[room].push([id, name]);
        } else {
            users[room] = [[id, name]];
        }
        socketToRoom[socket.id] = room;
        socket.emit("your id", id);
    });
    socket.on("get_users", room => {
        const usersInThisRoom = users[room].filter(id => id[0] !== socket.id);
        socket.emit("all users", usersInThisRoom);
    });
    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on("send message", ({ room, body, name }) => {
        io.to(room).emit("message", {
            body,
            name: name,
            id: socket.id
        })
    })

    socket.on('disconnect', () => {
        id = socket.id
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });
});

server.listen(process.env.PORT || 8000, () => console.log('server is running on port 8000'));

