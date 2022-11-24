function successfullLogin(data) {
  localStorage.setItem(
    "chessLogin",
    JSON.stringify({
      name: data.name,
      password: data.password,
    })
  );
  window.location.href = "/lobby.html";
}

export default successfullLogin;
