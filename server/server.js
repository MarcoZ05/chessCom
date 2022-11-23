const io = require("socket.io")(3000)

console.log("Socket server is running")

io.on('connection', socket => {
    console.log(socket.id)

    socket.on('disconnect', () => {

    })
})