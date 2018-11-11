const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.get(`/`, function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

http.listen(3000, function () {
    console.log("Listening on *:3000");
})

io.on("connection", function (socket)  {
    console.log("A user connected");
})