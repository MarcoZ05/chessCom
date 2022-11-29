const fs = require("fs");

function getRoomByName(name) {
  const rooms = require("./rooms.json");
  return rooms.find((room) => room.name === name);
}

function getRooms(openRoomsOnly = false) {
  const rooms = require("./rooms.json");
  if (openRoomsOnly) return rooms.filter((room) => room.open);
  return rooms;
}

function pushRoom(room) {
  const rooms = getRooms();
  rooms.push(room);
  fs.writeFileSync("./rooms.json", JSON.stringify(rooms, null, 2));
}

function updateRoom(room) {
  const rooms = getRooms();
  const index = rooms.findIndex((r) => r.name === room.name);
  rooms[index] = room;
  fs.writeFileSync("./rooms.json", JSON.stringify(rooms, null, 2));
}

function removeRoom(room) {
  const rooms = getRooms();
  const index = rooms.findIndex((r) => r.name === room.name);
  rooms.splice(index, 1);
  fs.writeFileSync("./rooms.json", JSON.stringify(rooms, null, 2));
}

module.exports = {
  getRoomByName,
  pushRoom,
  updateRoom,
  removeRoom,
  getRooms,
};
