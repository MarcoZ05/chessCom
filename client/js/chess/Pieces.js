import Position from "./Position.js";

class Piece {
  constructor(name, value, color, position, moveSet) {
    this.name = name;
    this.value = value;
    this.color = color;
    this.position = position;
    this.moveSet = moveSet;
    this.hasMoved = false;
    this.image = new Image();
    this.image.src = `./images/${color[0]}${name}.svg`;
  }

  getMoves(pieces) {
    const moves = [];

    // get all normal moves
    if (this.moveSet.moves) {
      this.moveSet.moves.forEach((move) => {
        let movePosition = new Position(
          this.position.x + move.x,
          this.position.y + move.y
        );
        const target = pieces.find(
          (piece) =>
            piece.position.x === movePosition.x &&
            piece.position.y === movePosition.y
        );

        if (
          (target && target.color === this.color) ||
          (target && !move.canCapture) ||
          (!target && move.mustCapture) ||
          movePosition.x < 0 ||
          movePosition.x > 7 ||
          movePosition.y < 0 ||
          movePosition.y > 7 ||
          (move.firstMove && this.hasMoved)
        )
          return;

        moves.push(movePosition);
      });
    }

    // get all castling moves
    if (this.moveSet.castling === true && this.hasMoved === false) {
      // get all possible rooks
      const rooks = pieces.filter(
        (piece) =>
          piece.name === "R" &&
          piece.color === this.color &&
          piece.hasMoved === false &&
          piece.position.x === this.position.x
      );

      rooks.forEach((rook) => {
        const movePosition = new Position(
          this.position.x,
          this.position.y + (rook.position.y - this.position.y) / 2
        );
        movePosition.castling = true;

        // check if there are any pieces in the way
        const piecesInWay = pieces.filter(
          (piece) =>
            piece.position.x === this.position.x &&
            piece.position.y > Math.min(this.position.y, rook.position.y) &&
            piece.position.y < Math.max(this.position.y, rook.position.y)
        );

        if (piecesInWay.length === 0) moves.push(movePosition);
      });
    }

    // get all diagonal moves
    if (this.moveSet.diagonal === true) {
      while (true) {
        const movePosition = new Position(
          this.position.x + 1,
          this.position.y + 1
        );
        const target = pieces.find((piece) => piece.position === movePosition);

        if (
          (target && target.color === this.color) ||
          movePosition.x < 0 ||
          movePosition.x > 7 ||
          movePosition.y < 0 ||
          movePosition.y > 7
        )
          return;
        if (target && target.color !== this.color) {
          moves.push(movePosition);
          return;
        }

        moves.push(movePosition);
      }

      while (true) {
        const movePosition = new Position(
          this.position.x + 1,
          this.position.y - 1
        );
        const target = pieces.find((piece) => piece.position === movePosition);

        if (
          (target && target.color === this.color) ||
          movePosition.x < 0 ||
          movePosition.x > 7 ||
          movePosition.y < 0 ||
          movePosition.y > 7
        )
          return;
        if (target && target.color !== this.color) {
          moves.push(movePosition);
          return;
        }

        moves.push(movePosition);
      }

      while (true) {
        const movePosition = new Position(
          this.position.x - 1,
          this.position.y + 1
        );
        const target = pieces.find((piece) => piece.position === movePosition);

        if (
          (target && target.color === this.color) ||
          movePosition.x < 0 ||
          movePosition.x > 7 ||
          movePosition.y < 0 ||
          movePosition.y > 7
        )
          return;
        if (target && target.color !== this.color) {
          moves.push(movePosition);
          return;
        }

        moves.push(movePosition);
      }

      while (true) {
        const movePosition = new Position(
          this.position.x - 1,
          this.position.y - 1
        );
        const target = pieces.find((piece) => piece.position === movePosition);

        if (
          (target && target.color === this.color) ||
          movePosition.x < 0 ||
          movePosition.x > 7 ||
          movePosition.y < 0 ||
          movePosition.y > 7
        )
          return;
        if (target && target.color !== this.color) {
          moves.push(movePosition);
          return;
        }

        moves.push(movePosition);
      }
    }

    // get all straight moves
    if (this.moveSet.straight === true) {
      while (true) {
        const movePosition = new Position(this.position.x, this.position.y + 1);
        const target = pieces.find((piece) => piece.position === movePosition);

        if (
          (target && target.color === this.color) ||
          movePosition.x < 0 ||
          movePosition.x > 7 ||
          movePosition.y < 0 ||
          movePosition.y > 7
        )
          return;
        if (target && target.color !== this.color) {
          moves.push(movePosition);
          return;
        }

        moves.push(movePosition);
      }

      while (true) {
        const movePosition = new Position(this.position.x, this.position.y - 1);
        const target = pieces.find((piece) => piece.position === movePosition);

        if (
          (target && target.color === this.color) ||
          movePosition.x < 0 ||
          movePosition.x > 7 ||
          movePosition.y < 0 ||
          movePosition.y > 7
        )
          return;
        if (target && target.color !== this.color) {
          moves.push(movePosition);
          return;
        }

        moves.push(movePosition);
      }

      while (true) {
        const movePosition = new Position(this.position.x + 1, this.position.y);
        const target = pieces.find((piece) => piece.position === movePosition);

        if (
          (target && target.color === this.color) ||
          movePosition.x < 0 ||
          movePosition.x > 7 ||
          movePosition.y < 0 ||
          movePosition.y > 7
        )
          return;
        if (target && target.color !== this.color) {
          moves.push(movePosition);
          return;
        }

        moves.push(movePosition);
      }

      while (true) {
        const movePosition = new Position(this.position.x - 1, this.position.y);
        const target = pieces.find((piece) => piece.position === movePosition);

        if (
          (target && target.color === this.color) ||
          movePosition.x < 0 ||
          movePosition.x > 7 ||
          movePosition.y < 0 ||
          movePosition.y > 7
        )
          return;
        if (target && target.color !== this.color) {
          moves.push(movePosition);
          return;
        }

        moves.push(movePosition);
      }
    }

    // TODO: add en passant
    if (this.moveSet.enPassant === true) {
    }

    // TODO: add promotion
    if (this.moveSet.promotion === true) {
    }

    return moves;
  }
}

class K extends Piece {
  constructor(color, position) {
    super("K", 0, color, position, {
      moves: [
        { x: -1, y: -1 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
      ],
      castling: true,
    });
  }
}

class Q extends Piece {
  constructor(color, position) {
    super("Q", 9, color, position, {
      diagonal: true,
      straight: true,
    });
  }
}

class R extends Piece {
  constructor(color, position) {
    super("R", 5, color, position, {
      straight: true,
    });
  }
}

class B extends Piece {
  constructor(color, position) {
    super("B", 3, color, position, {
      diagonal: true,
    });
  }
}

class N extends Piece {
  constructor(color, position) {
    super("N", 3, color, position, {
      moves: [
        { x: -2, y: -1 },
        { x: -2, y: 1 },
        { x: -1, y: -2 },
        { x: -1, y: 2 },
        { x: 1, y: -2 },
        { x: 1, y: 2 },
        { x: 2, y: -1 },
        { x: 2, y: 1 },
      ],
    });
  }
}

class P extends Piece {
  constructor(color, position) {
    super("P", 1, color, position, {
      moves: [
        { x: -1, y: 0, canCapture: false },
        { x: -1, y: -1, mustCapture: true },
        { x: -1, y: 1, mustCapture: true },
        { x: -2, y: 0, firstMove: true },
      ],
      enPassant: true,
      promotion: true,
    });
  }
}

export { Piece as default, K, Q, R, B, N, P };
