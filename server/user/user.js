const fs = require("fs");

function getUserByName(name) {
  const users = require("./users.json");
  return users.find((user) => user.name === name);
}

function getUsers() {
  return require("./users.json");
}

function pushUser(user) {
  const users = getUsers();
  users.push(user);
  fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
}

function updateUser(user) {
  const users = getUsers();
  const index = users.findIndex((u) => u.name === user.name);
  users[index] = user;
  fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
}

module.exports = {
  getUserByName,
  pushUser,
  updateUser,
};
