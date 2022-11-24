const socket = io();

const accountLogout = document.getElementById("account_logout");
const accountName = document.getElementById("account_name");
const accountEmail = document.getElementById("account_email");

const roomsContainer = document.getElementById("room");

const createRoomForm = document.getElementById("create_room");
const createRoomPassword = document.getElementById("create_room_password");
