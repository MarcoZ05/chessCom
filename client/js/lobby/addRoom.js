function createRoomElem(room) {
  var roomElement = document.createElement("div");
  roomElement.className = "room";
  roomElement.innerHTML = room.name;

  const roomPlayers = document.createElement("div");
  roomPlayers.classList.add("room_players");
  roomPlayers.innerText = `${room.players.length}/2`;
  roomElement.appendChild(roomPlayers);

  const roomName = document.createElement("div");
  roomName.classList.add("room_name");
  roomName.innerText = room.name;
  roomElement.appendChild(roomName);

  roomElement.onclick = function () {
    socket.emit("joinRoom", {
      room: room.name,
      password: "",
    });
  };

  return roomElement;
}

export default createRoomElem;
