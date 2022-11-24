const socket = io();

const loginForm = document.getElementById("login");
const loginName = document.getElementById("login_name");
const loginPassword = document.getElementById("login_password");

const registerForm = document.getElementById("register");
const registerName = document.getElementById("register_name");
const registerPassword0 = document.getElementById("register_password_0");
const registerPassword1 = document.getElementById("register_password_1");

if (localStorage.getItem("chessLogin")) {
  const login = JSON.parse(localStorage.getItem("chessLogin"));
  socket.emit("login", login);

  loginName.value = JSON.parse(localStorage.getItem("chessLogin")).name;
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  socket.emit("login", {
    name: loginName.value,
    password: loginPassword.value,
  });
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (registerPassword0.value !== registerPassword1.value) return;
  socket.emit("register", {
    name: registerName.value,
    password0: registerPassword0.value,
    password1: registerPassword1.value,
  });
});

socket.on("login", (data) => {
  if (data.success) {
    successfullLogin(data);
  } else {
    alert(data.error);
  }
});

socket.on("register", (data) => {
  if (data.success) {
    successfullLogin(data);
  } else {
    alert(data.error);
  }
});

function successfullLogin(data) {
  localStorage.setItem(
    "chessLogin",
    JSON.stringify({
      name: data.name,
      password: data.password,
    })
  );
  window.location.href = "/chess.html";
}
