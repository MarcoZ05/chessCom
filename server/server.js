const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const generateCode = require("./generateCode.js");
const sendVerificationEmail = require("./sendVerificationEmail.js");
const { getUserByName, pushUser, updateUser } = require("./user.js");
const {
  getRoomByName,
  pushRoom,
  updateRoom,
  removeRoom,
  getRooms,
} = require("./room.js");

const app = express();
const server = http.createServer(app);

const io = new Server(server);
const port = 3000;

app.use(express.static("../client"));

io.on("connection", (socket) => {
  socket.on("login", ({ name, password }) => {
    const user = getUserByName(name);

    if (user && user.password === password)
      return socket.emit("login", {
        success: true,
        name: name,
        password: password,
      });

    socket.emit("login", {
      success: false,
      error: "Invalid username or password",
      name: name,
      password: password,
    });
  });

  socket.on("register", ({ name, email, password0, password1 }) => {
    if (password0 !== password1)
      return socket.emit("register", {
        success: false,
        error: "Passwords do not match",
      });

    if (password0.length < 4)
      return socket.emit("register", {
        success: false,
        error: "Password must be at least 4 characters long",
      });

    if (name.length < 3)
      return socket.emit("register", {
        success: false,
        error: "Username must be at least 3 characters long",
      });

    if (!/^[a-zA-Z0-9]+$/.test(name))
      return socket.emit("register", {
        success: false,
        error: "Username must only contain letters and numbers",
      });

    if (!/^[a-zA-Z0-9]+$/.test(password0))
      return socket.emit("register", {
        success: false,
        error: "Password must only contain letters and numbers",
      });

    const user = getUserByName(name);

    if (user)
      return socket.emit("register", {
        success: false,
        error: "Username already exists",
        name,
        password: password0,
        email,
      });

    const verifyToken = generateCode(6);
    sendVerificationEmail(name, email, verifyToken);

    socket.emit("register", {
      success: true,
      verifyToken,
      name,
      password: password0,
      email,
    });

    pushUser({
      name,
      password: password0,
      email,
      verifyToken,
      verified: false,
      created: new Date(),
    });
  });

  socket.on("verify", ({ verifyToken, name, email, password }) => {
    const user = getUserByName(name);

    if (!user || user.verifyToken !== verifyToken)
      return socket.emit("verify", {
        success: false,
        error: "Invalid verification code",
      });

    user.verified = true;
    user.verifyToken = null;

    updateUser(user);

    socket.emit("verify", {
      success: true,
      name: name,
      password: password,
      email: email,
    });
  });

  socket.on("joinRandomRoom", () => {
    const rooms = getRooms(true);

    if (rooms.length === 0)
      return socket.emit("joinRandomRoom", {
        success: false,
        error: "No open rooms",
      });

    const room = rooms[Math.floor(Math.random() * rooms.length)];

    socket.emit("joinRandomRoom", {
      success: true,
      room: room.name,
    });

    const roomIndex = getRooms().findIndex((r) => r.name === room.name);

    room.players.push(socket.id);

    io.emit("updateRooms", getRooms());
  });

  socket.on("createRoom", ({ password }) => {
    let roomName = generateCode(4);
    while (getRoomByName(roomName)) roomName = generateCode(4);

    if (password.length === 0) password = null;

    pushRoom({
      name: roomName,
      password: password,
      players: [
        {
          name: socket.id,
          color: "white",
        },
      ],
      created: new Date(),
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
      turn: "w",
      history: [],
    });

    socket.emit("createRoom", {
      success: true,
      room: roomName,
    });

    io.emit("updateRooms", getRooms());
  });

  socket.on("joinRoom", ({ room, password }) => {
    const roomObj = getRoomByName(room);

    if (!roomObj)
      return socket.emit("joinRoom", {
        success: false,
        error: "Room does not exist",
      });

    if (roomObj.password !== password && roomObj.password !== null)
      return socket.emit("joinRoom", {
        success: false,
        error: "Invalid password",
      });

    socket.emit("joinRoom", {
      success: true,
      room: roomObj.name,
    });

    const roomIndex = getRooms().findIndex((r) => r.name === roomObj.name);

    roomObj.players.push(socket.id);

    updateRoom(roomIndex, roomObj);

    io.emit("updateRooms", getRooms());
  });

  socket.on("move", ({ move }) => {
    const room = getRooms().find((r) => r.players.includes(socket.id));

    if (!room) return;

    room.fen = move.fen;
    room.turn = move.turn;
    room.history.push(move);

    const players = room.players.filter((p) => p !== socket.id);

    players.forEach((p) => io.to(p).emit("move", move));
  });
});

server.listen(port, () => console.log(`listening on *:${port}`));
