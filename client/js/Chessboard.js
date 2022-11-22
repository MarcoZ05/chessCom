import * as Pieces from "./Pieces.js";
import Position from "./Position.js";

class Chessboard {
  constructor(chessboardDiv, color) {
    // create a new chessboard
    this.pieces = [];
    this.chessboardDiv = chessboardDiv;
    this.playersColor = color;
    this.selectedPiece = null;
    this.turn = true;
    this.lastMove = [];

    this.chessboardDiv.addEventListener("click", (e) => {
      if (e.target === this.chessboardDiv) {
        this.selectedPiece = null;
        this.render();
      }
    });
  }

  movePiece(piece, position) {
    if (this.selectedPiece === piece) {
      this.selectedPiece = null;
    }

    this.lastMove = [piece.position, position];

    const pieceIndex = this.pieces.findIndex((p) => p === piece);
    this.pieces[pieceIndex].position = position;

    this.render();
  }

  selectPiece(piece) {
    this.selectedPiece = piece;
    this.render();
  }

  render() {
    this.chessboardDiv.innerHTML = "";

    // pieces
    this.pieces.forEach((piece) => {
      const pieceDiv = document.createElement("div");
      if (this.playersColor === "white") {
        pieceDiv.style.gridColumn = piece.position.y + 1;
        pieceDiv.style.gridRow = piece.position.x + 1;
      } else {
        pieceDiv.style.gridColumn = 8 - piece.position.y;
        pieceDiv.style.gridRow = 8 - piece.position.x;
      }
      pieceDiv.classList.add("piece");
      pieceDiv.style.backgroundImage = `url(${piece.image.src})`;

      if (this.selectedPiece === piece) pieceDiv.classList.add("selected");

      if (this.playersColor === piece.color) {
        pieceDiv.addEventListener("click", () => {
          this.selectPiece(piece);
        });
      }

      this.chessboardDiv.appendChild(pieceDiv);
    });

    // selected piece
    if (this.selectedPiece && this.selectedPiece.getMoves(this.pieces)) {
      this.selectedPiece.getMoves(this.pieces).forEach((move) => {
        const moveDiv = document.createElement("div");
        if (this.playersColor === "white") {
          moveDiv.style.gridColumn = move.y + 1;
          moveDiv.style.gridRow = move.x + 1;
        } else {
          moveDiv.style.gridColumn = 8 - move.y;
          moveDiv.style.gridRow = 8 - move.x;
        }
        moveDiv.classList.add("move");

        moveDiv.addEventListener("click", () => {
          if (this.turn) {
            this.movePiece(this.selectedPiece, move);
            this.turn = false;
          }
        });

        this.chessboardDiv.appendChild(moveDiv);
      });
    }

    // last move
    if (this.lastMove.length > 0) {
      this.lastMove.forEach((move) => {
        const moveDiv = document.createElement("div");
        if (this.playersColor === "white") {
          moveDiv.style.gridColumn = move.y + 1;
          moveDiv.style.gridRow = move.x + 1;
        } else {
          moveDiv.style.gridColumn = 8 - move.y;
          moveDiv.style.gridRow = 8 - move.x;
        }
        moveDiv.classList.add("last-move");
        this.chessboardDiv.appendChild(moveDiv);
      });
    }
  }

  piecesFromFen(fen) {
    fen.split("/").forEach((row, rowIndex) => {
      let colIndex = 0;

      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === " ") break;
        if (isNaN(char)) {
          const pieceChar = char.toUpperCase();
          const pieceColor = char === pieceChar ? "white" : "black";
          const piece = new Pieces[pieceChar](
            pieceColor,
            new Position(rowIndex, colIndex)
          );
          this.pieces.push(piece);
          colIndex++;
        } else {
          colIndex += parseInt(char);
        }
      }
    });
  }
}

export default Chessboard;
