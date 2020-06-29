
class Game {
  constructor() {
    this.size = 4;
    this.initializeTiles();
  }

  initializeTiles() {
    this.tiles = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.tiles[i] = new Array(this.size);
    }
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.tiles[i][j] = i * this.size + j + 1;
      }
    }
    this.xPos = 3;
    this.yPos = 3;

    
    this.shuffleTiles(10000);
  }

  shuffleTiles(n) {
    for (let i = 0; i < n; i++) {
      const n = Math.floor(Math.random() * 4);
      if (n === 0) {
        this.move('ArrowUp');
      } else if (n === 1) {
        this.move('ArrowDown');
      } else if (n === 2) {
        this.move('ArrowLeft');
      } else if (n === 3) {
        this.move('ArrowRight');
      }
    }
  }

  checkWin() {
    for (let i = 0; i < this.size; i++) {
      let n = 1 + i * this.size;
      for (let j = 0; j < this.size; j++) {
        if (this.tiles[i][j] !== n) {
          return false;
        }
        n++;
      }
    }
    return true;
  }

  move(direction) {
    switch (direction) {
      case 'ArrowUp': {
        if (this.yPos !== 0) {
          this.tiles[this.yPos][this.xPos] = this.tiles[this.yPos - 1][this.xPos];
          this.tiles[this.yPos - 1][this.xPos] = 16;
          this.yPos--;
        }
        break;
      }
      case 'ArrowDown': {
        if (this.yPos !== this.size - 1) {
          this.tiles[this.yPos][this.xPos] = this.tiles[this.yPos + 1][this.xPos];
          this.tiles[this.yPos + 1][this.xPos] = 16;
          this.yPos++;
        }
        break;
      }
      case 'ArrowLeft': {
        if (this.xPos !== 0) {
          this.tiles[this.yPos][this.xPos] = this.tiles[this.yPos][this.xPos - 1];
          this.tiles[this.yPos][this.xPos - 1] = 16;
          this.xPos--;
        }
        break;
      }
      case 'ArrowRight': {
        if (this.xPos !== this.size - 1) {
          this.tiles[this.yPos][this.xPos] = this.tiles[this.yPos][this.xPos + 1];
          this.tiles[this.yPos][this.xPos + 1] = 16;
          this.xPos++;
        }
        break;
      }
    }
  }
}

window.onload = () => {
  const canvas = document.querySelector('canvas');
  canvas.width = 800;
  canvas.height = 800;

  const c = canvas.getContext('2d');

  const game = new Game();

  let isRunning = false;
  let hasWon = false;
  let startTime = null;
  let currentTime = 0;

  function start() {
    window.onkeydown = (e) => {
      if (!isRunning) {
        startTime = Date.now();
      }
      if (e.keyCode >= 37 && e.keyCode <= 40) {
        isRunning = true;
        if (!hasWon) {
          game.move(e.key);
        }
        if (game.checkWin() === true) {
          isRunning = false;
          hasWon = true;
          const time = (Date.now() - startTime) / 1000;
          const record = Number(localStorage.getItem(`@fifteen-game/${game.size}-recordTime`));
          if (time < record || record === null) {
            localStorage.setItem(`@fifteen-game/${game.size}-recordTime`, currentTime);
          }
        }
      }
    }
    c.font = '90px sans-serif';
  }
  
  function draw() {
    requestAnimationFrame(draw);
    c.clearRect(0, 0, canvas.width, canvas.height);

    if (isRunning) {
      currentTime = (Date.now() - startTime) / 1000;
      document.querySelector('p').innerHTML =
        `Time: ${currentTime}`;
    }

    game.tiles.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell !== 16) {
          c.fillStyle = '#000';
          c.fillRect(j * 200 + 2, i * 200 + 2, 196, 196);
          c.fillStyle = '#ccc';
          c.fillText(cell,
            j * 200 + 100 - c.measureText(cell).width / 2,
            i * 200 + 130
          );
        }
      });
    });
  }

  start();
  draw();
}

