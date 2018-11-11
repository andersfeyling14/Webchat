const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.get(`/`, function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

http.listen(3000, function () {
    console.log("Listening on *:3000");
})

io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on("disconnect", function () {
        console.log("User disconnected");
    })
})

io.on("connection", function (socket) {
    socket.on("chat message", function (msg) {
        console.log("message: ", msg);
    });
});

io.emit("some event", {for: "everyone"});

io.on("connection", function (socket) {
   socket.on("chat message", function (msg) {
       io.emit("chat message", msg);
   });
});