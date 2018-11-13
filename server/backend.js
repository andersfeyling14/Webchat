import {LitElement, html} from '@polymer/lit-element';

const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

let names = ["alice",
    "bobby",
    "charlie",
    "dave",
    "eric",
    "fredrick",
    "gavin",
    "henrietta",
    "ivan",
    "jean",
    "kate"];


users = [];
connections = [];

app.get(`/`, function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

server.listen(3000, function () {
    console.log("Listening on *:3000");
})

//Server side connection.
io.on("connection", function (socket) {
    connections.push(socket);
    console.log("A user connected. %s users connected", connections.length);

    //Disconnect
    socket.on("disconnect", function () {
        users.splice(users.indexOf(socket.username), 1);
        updateUsers();
        connections.splice(connections.indexOf(socket), 1);
        console.log("User disconnected. %s users connected", connections.length);
    })

    //Send message to receivers
    socket.on("chat-message", function (data) {
        console.log("message: ", data);

        // $$ Send msg to sockets $$
        //io.emit("chat-message", {msg: data}); //send to everyone INCLUDING sender
        //socket.broadcast.emit("chat-message", {msg: data, user: socket.username}); //send to everyone EXCLUDING sender
        socket.broadcast.emit("chat-message", {msg: data}); //send to everyone EXCLUDING sender
    });

    //  $$ New user $$
    socket.on("new-user", function (data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsers();
    });
    function updateUsers() {
        io.sockets.emit("get-users", users);
    }
});


 //   Each socket fires unique `connection` and `disconnect` events.

/*io.on("connection", function (socket) {
    socket.on("chat-message", function (msg) {
        console.log("message: ", msg);
    });
});*/

/*io.on("connection", function (socket) {
   socket.on("chat-message", function (msg) {
       //io.emit("chat-message", msg); //send to everyone INCLUDING sender
       socket.broadcast.emit("chat-message", msg); //send to everyone EXCLUDING sender
   });
});*/


