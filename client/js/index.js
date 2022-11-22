import Chessboard from "./Chessboard.js";

const chessboardDiv = document.getElementById("chessboard");

// get some data from socket
const playersColor = "white";
const startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

// create a new chessboard
const chessboard = new Chessboard(chessboardDiv, playersColor);
chessboard.piecesFromFen(startingPosition);
chessboard.render();
