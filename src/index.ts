declare const process;
declare const require;
const keypress = require('keypress');
const clear = require('clear');
const InputEvent = require('input-event');

// Width and height for the screen
var width: number = process.stdout.columns;
var height: number = process.stdout.rows - 2;

// Game clock interval
var gameClock;
var gameSpeed: number;

// ball
var ball = {
  dirX: 'RIGHT',
  dirY: 'UP',
  x: Math.round(width / 2),
  y: Math.round(height / 2)
}

// Paddles
var padA = {
  x: 1,
  coordFrom: 0,
  coordTo: 7,
  score: 0
}
var padB = {
  x: width - 2,
  coordFrom: height - 8,
  coordTo: height - 1,
  score: 0
}

// Do all stuff here, all functions will be hoisted
setupControllers(padA, padB, movePad);
drawScreen(width, height, padA, padB, ball);

// Start ball moving
function startMoving() {
  gameSpeed = 75;
  function timeoutFn() {
    moveBall();
    gameSpeed = gameSpeed * 0.999;
    gameClock = setTimeout(timeoutFn, gameSpeed);
    return gameClock;
  }
  gameClock = setTimeout(timeoutFn, gameSpeed);
}

// Stop ball moving
function stopMoving() {
  clearTimeout(gameClock);
  gameClock = null;
  gameSpeed = 75;
}

// Move ball function
function moveBall() {
  var nextX, nextY;
  if(ball.dirX == 'LEFT') {
    nextX = ball.x - 1;
  } else if(ball.dirX == 'RIGHT') {
    nextX = ball.x + 1;
  }
  if(ball.dirY == 'UP') {
    nextY = ball.y - 1;
  } else if(ball.dirY == 'DOWN') {
    nextY = ball.y + 1;
  }
  if(nextX > padA.x && nextX < padB.x) {
    if(nextY > 0 && nextY < height - 1) {
      // all good
    } else {
      if(nextY <= 0) { ball.dirY = 'DOWN'; nextY = 1 }
      if(nextY >= height - 1) { ball.dirY = 'UP'; nextY = height - 2 }
    }
  } else {
    if(nextX == padA.x) {
      if(nextY >= padA.coordFrom && nextY <= padA.coordTo) {
        // Ball hits paddle
        ball.dirX = 'RIGHT';
        nextX = padA.x + 1;
      } else {
        // Ball misses paddle
        missTheBall('A');
        return;
      }
    } else if(nextX == padB.x) {
      if(nextY >= padB.coordFrom && nextY <= padB.coordTo) {
        // Ball hits paddle
        ball.dirX = 'LEFT';
        nextX = padB.x - 1;
      } else {
        // Ball misses paddle
        missTheBall('B');
        return;
      }
    }
  }
  ball.x = nextX;
  ball.y = nextY;
  drawScreen(width, height, padA, padB, ball);
}

// Miss the ball action
function missTheBall(player) {
  if(player == 'A') {
    padB.score++;
    ball.dirX = 'RIGHT'
  } else if(player == 'B') {
    padA.score++;
    ball.dirX = 'LEFT'
  }
  ball.x = Math.round(width / 2);
  ball.y = Math.round(height / 2);
  drawScreen(width, height, padA, padB, ball);
  stopMoving();
}

// Move paddle function
function movePad(pad, direction) {
  if(!gameClock) startMoving();
  if(direction == 'UP') {
    if(pad.coordFrom > 0) {
      pad.coordFrom--;
      pad.coordTo--;
    }
  } else if(direction == 'DOWN') {
    if(pad.coordTo < height-1) {
      pad.coordFrom++;
      pad.coordTo++;
    }
  }
  drawScreen(width, height, padA, padB, ball);
}

// Accepts paddle A, paddle B and move function
function setupControllers(padA, padB, movePaddle) {
  keypress(process.stdin);
  process.stdin.on('keypress', function (ch, key) {
    if(key.ctrl && key.name == 'c') process.exit();
    if(ball.dirX == 'LEFT') {
      switch(key.name) {
        case 'w': return movePaddle(padA, 'UP');
        case 's': return movePaddle(padA, 'DOWN');
      }
    } else {
      switch(key.name) {
        case 'up': return movePaddle(padB, 'UP');
        case 'down': return movePaddle(padB, 'DOWN');
      }
    }
  });
  process.stdin.setRawMode(true);
  process.stdin.resume();
}


// Draws everything to screen
function drawScreen(width, height, padA, padB, ball) {
  clear();
  var out = '';
  var title: string = padA.score + ':' + padB.score;
  console.log(padStart(title, width / 2 - 6));
  for(let j = 0; j < height; j++) {
    for(let i = 0; i < width; i++) {
      if(padA.x == i && (j >= padA.coordFrom && j <= padA.coordTo)) {
        out += '║';
        continue;
      }
      if(padB.x == i && (j >= padB.coordFrom && j <= padB.coordTo)) {
        out += '║';
        continue;
      }
      if(ball.x == i && ball.y == j) {
        out += '◉';
        continue;
      }
      out += ' ';
    }
    out += '\n';
  }
  process.stdout.write(out);
}

function padStart(str, count) {
  for(let i = 0; i < count; i++) {
    str = ' ' + str;
  }
  return str;
}
