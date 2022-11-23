const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);

const io = new Server(server);
const port = 3000;

app.use(express.static("../client"));

io.on("connection", (socket) => {
  socket.on("login", (data) => {
    const users = require("./users.json");
    const user = users.find((user) => user.name === data.name);

    if (user && user.password === data.password) {
      socket.emit("login", {
        success: true,
        name: user.name,
        password: user.password,
      });
    } else {
      socket.emit("login", {
        success: false,
        error: "Invalid username or password",
      });
    }
  });

  socket.on("register", (data) => {
    if (data.password0 !== data.password1) {
      return socket.emit("register", {
        success: false,
        error: "Passwords do not match",
      });
    }
    if (data.password0.length < 8) {
      return socket.emit("register", {
        success: false,
        error: "Password must be at least 8 characters long",
      });
    }
    if (data.name.length < 3) {
      return socket.emit("register", {
        success: false,
        error: "Username must be at least 3 characters long",
      });
    }
    if (!/^[a-zA-Z0-9]+$/.test(data.name)) {
      return socket.emit("register", {
        success: false,
        error: "Username must only contain letters and numbers",
      });
    }
    if (!/^[a-zA-Z0-9]+$/.test(data.password0)) {
      return socket.emit("register", {
        success: false,
        error: "Password must only contain letters and numbers",
      });
    }

    const users = require("./users.json");
    const user = users.find((user) => user.name === data.name);

    if (user)
      return socket.emit("register", {
        success: false,
        error: "Username already exists",
        name: data.name,
        password: data.password0,
      });

    users.push({
      name: data.name,
      password: data.password0,
    });

    fs.writeFileSync("./users.json", JSON.stringify(users));

    socket.emit("register", { success: true });
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
