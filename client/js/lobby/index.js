import addRoom from "./addRoom.js";

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

// join random room
joinRoomForm.addEventListener("submit", (event) => {
  event.preventDefault();

  socket.emit("joinRandomRoom");
});
socket.on("joinRandomRoom", ({ success, room, error }) => {
  if (!success) return;

  window.location.href = `/chess.html?room=${room}`;
});

// join room
joinRoomButton.addEventListener("click", () => {
  if (joinRoomButton.innerText === "Join Room")
    socket.emit("joinRoom", {
      room: joinRoomID.value,
      password: joinRoomPassword.value,
    });
  else socket.emit("joinRandomRoom");
});
socket.on("joinRoom", ({ success, room, error }) => {
  if (!success) return;

  window.location.href = `/chess.html?room=${room}`;
});

// create room
createRoomForm.addEventListener("submit", (event) => {
  event.preventDefault();

  socket.emit("createRoom", {
    password: createRoomPassword.value,
  });
});
socket.on("createRoom", ({ success, room, error }) => {
  if (!success) return;

  window.location.href = `/chess.html?room=${room}`;
});

// update rooms
socket.on("updateRooms", (rooms) => {
  roomsContainer.innerHTML = "";

  rooms.forEach((room) => {
    const roomElement = addRoom(room);

    roomsContainer.appendChild(roomElement);
  });
});
