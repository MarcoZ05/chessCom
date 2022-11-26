const socket = io();

const accountLogout = document.getElementById("account_logout");
const accountName = document.getElementById("account_name");

const roomsContainer = document.getElementById("room");

const joinRoomForm = document.getElementById("join_room");
const joinRoomID = document.getElementById("join_room_id");
const joinRoomPassword = document.getElementById("join_room_password");
const joinRoomButton = document.getElementById("join_room_button");

const createRoomForm = document.getElementById("create_room");
const createRoomPassword = document.getElementById("create_room_password");

// login
if (localStorage.getItem("chessLogin")) {
  const login = JSON.parse(localStorage.getItem("chessLogin"));
  socket.emit("login", login);
} else accountLogout.click();

// logout
accountLogout.addEventListener("click", () => {
  localStorage.removeItem("chessLogin");
});

socket.on("login", ({ name, success }) => {
  if (!success) return accountLogout.click();

  accountName.innerText = name;
});

// join random room
joinRoomForm.addEventListener("submit", (event) => {
  event.preventDefault();

  socket.emit("joinRandomRoom");
});

// join room or join random room
joinRoomID.addEventListener("input", (event) => {
  let newButton = "Join Random Room";

  if (joinRoomID.value.length !== 0) newButton = "Join Room";

  if (newButton !== joinRoomButton.innerText) {
    joinRoomButton.classList.add("textFade");
    setTimeout(() => {
      joinRoomButton.innerText = newButton;
      joinRoomButton.classList.remove("textFade");
    }, 500);
  }
});
