const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const generateCode = require("./generateCode.js");
const sendVerificationEmail = require("./sendVerificationEmail.js");
const { getUserByName, pushUser, updateUser } = require("./user.js");

const app = express();
const server = http.createServer(app);

const io = new Server(server);
const port = 3000;

app.use(express.static("../client"));

io.on("connection", (socket) => {
  socket.on("login", ({ name, password }) => {
    const user = getUserByName(name);

    if (user && user.password === password) {
      socket.emit("login", {
        success: true,
        name: name,
        password: password,
      });
    } else {
      socket.emit("login", {
        success: false,
        error: "Invalid username or password",
        name: name,
        password: password,
      });
    }
  });

  socket.on("register", ({ name, email, password0, password1 }) => {
    if (password0 !== password1) {
      return socket.emit("register", {
        success: false,
        error: "Passwords do not match",
      });
    }
    if (password0.length < 4) {
      return socket.emit("register", {
        success: false,
        error: "Password must be at least 4 characters long",
      });
    }
    if (name.length < 3) {
      return socket.emit("register", {
        success: false,
        error: "Username must be at least 3 characters long",
      });
    }
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      return socket.emit("register", {
        success: false,
        error: "Username must only contain letters and numbers",
      });
    }
    if (!/^[a-zA-Z0-9]+$/.test(password0)) {
      return socket.emit("register", {
        success: false,
        error: "Password must only contain letters and numbers",
      });
    }

    const user = getUserByName(name);

    if (user) {
      return socket.emit("register", {
        success: false,
        error: "Username already exists",
        name,
        password: password0,
        email,
      });
    }

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

    if (!user || user.verifyToken !== verifyToken) {
      socket.emit("verify", {
        success: false,
        error: "Invalid verification code",
      });
      return;
    }

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
});

server.listen(port, () => console.log(`listening on *:${port}`));
