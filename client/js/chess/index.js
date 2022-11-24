import Chessboard from "./Chessboard.js";

const chessboardDiv = document.getElementById("chessboard");

var playersColor 
var startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

// create a new chessboard
const chessboard = new Chessboard(chessboardDiv, playersColor);
chessboard.piecesFromFen(startingPosition);
chessboard.render();
