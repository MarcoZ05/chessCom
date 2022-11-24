import successfullLogin from "./successfullLogin.js";

const socket = io();

const loginForm = document.getElementById("login");
const loginName = document.getElementById("login_name");
const loginPassword = document.getElementById("login_password");

const registerForm = document.getElementById("register");
const registerName = document.getElementById("register_name");
const registerEmail = document.getElementById("register_email");
const registerPassword0 = document.getElementById("register_password_0");
const registerPassword1 = document.getElementById("register_password_1");

const verifyForm = document.getElementById("verify");
const verifyInput = document.getElementById("verify_input");

// login if data is stored in local storage
if (localStorage.getItem("chessLogin")) {
  const login = JSON.parse(localStorage.getItem("chessLogin"));
  socket.emit("login", login);
}

// login form
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // try to login
  socket.emit("login", {
    name: loginName.value.trim(),
    password: loginPassword.value.trim(),
  });
});

// register form
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // try to register
  if (registerPassword0.value === registerPassword1.value)
    socket.emit("register", {
      name: registerName.value.trim(),
      email: registerEmail.value.trim(),
      password0: registerPassword0.value.trim(),
      password1: registerPassword1.value.trim(),
    });
});

// verify form
verifyForm.addEventListener("submit", (e) => {
  e.preventDefault();

  socket.emit("verify", {
    verifyToken: verifyInput.value.toUpperCase().trim(),
    name: registerName.value.trim(),
    email: registerEmail.value.trim(),
    password0: registerPassword0.value.trim(),
    password1: registerPassword1.value.trim(),
  });
});

socket.on("login", (data) => {
  if (data.success) successfullLogin(data);
});

socket.on("register", (data) => {
  if (!data.success) return;

  loginForm.style.display = "none";
  registerForm.style.display = "none";
  verifyForm.style.display = "block";
});

socket.on("verify", (data) => {
  console.log(data);

  if (data.success) successfullLogin(data);
});
