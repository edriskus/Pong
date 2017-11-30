/*
  Atari Pong interpretation
  Edmundas Riskus
  PRIf-15/2

  Copyright 2017 Edmundas Riskus

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Node.js specific functions to declare for tsc to understand
declare const process;
declare const require;
// 3rd party modules
// const keypress = require('keypress');
const InputEvent = require('input-event');
const term = require( 'terminal-kit' ).terminal ;

// Width and height for the screen
var width: number = process.stdout.columns;
var height: number = process.stdout.rows - 2;
var startSize: number = 7;
var initGS: number = 55;
var speeDelta = 0.9999;

// Game clock interval
var gameClock;
var gameSpeed: number;

// Ball object
var ball = {
  dirX: 'RIGHT',
  dirY: 'UP',
  x: Math.round(width / 2),
  y: Math.round(height / 2)
}

// Paddle objects
var padA = {
  x: 1,
  size: startSize,
  coordFrom: 0,
  coordTo: startSize - 1,
  score: 0
}
var padB = {
  x: width - 2,
  size: startSize,
  coordFrom: height - 8,
  coordTo: height - 8 + (startSize - 1),
  score: 0
}

// Launch stuff here, all necessary functions will be hoisted
setupControllers(padA, padB, movePad);
drawScreen(width, height, padA, padB, ball);

// Start ball moving
function startMoving() {
  gameSpeed = initGS;
  function timeoutFn() {
    moveBall();
    gameSpeed = gameSpeed * speeDelta;
    gameClock = setTimeout(timeoutFn, gameSpeed);
    return gameClock;
  }
  gameClock = setTimeout(timeoutFn, gameSpeed);
}

// Stop ball moving
function stopMoving() {
  clearTimeout(gameClock);
  gameClock = null;
  gameSpeed = initGS;
}

// Move the AI
function moveAI(y, ww = width) {
  var predictY: any = 0;
  var w = ww - 4;
  var h = height;
  var hmo = h - 1;
  var leftW;
  if(ball.dirY == 'UP') {
    leftW = (w - y);
    predictY = leftW % hmo;
    if(Math.floor(leftW / hmo) % 2) predictY = hmo - predictY;
    else predictY--;
  } else {
    leftW = (w - (hmo - y));
    predictY = leftW % hmo;
    if(Math.floor(leftW / hmo) % 2 == 0) predictY = hmo - predictY;
    else predictY--;
  }
  interpolateMoving(padA, predictY + Math.floor(Math.random() * 5 - 3), (ww - 6) * gameSpeed );
}

// Move paddle to speific Y over specified duration
function interpolateMoving(pad, destY, duration) {
  var padCoordY = pad.coordFrom + Math.floor(pad.size / 2);
  var dir = (padCoordY - destY > 0) ? 'UP' : 'DOWN';
  var delta = Math.abs(padCoordY - destY);
  var speed = duration / delta;
  var interval = setInterval(function() {
    movePad(pad, dir);
    duration -= speed;
    if(duration <= 0) clearInterval(interval);
  }, speed)
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
    if(nextY >= 0 && nextY <= height - 1) {
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
        moveAI(ball.y);
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
  moveAI(ball.y, Math.floor(width / 2) + 2);
  drawScreen(width, height, padA, padB, ball);
  stopMoving();
}

// Move paddle function
function movePad(pad, val) {
  if(!gameClock) startMoving();
  if(val == 'UP') {
    if(pad.coordFrom > 0) {
      pad.coordFrom--;
      pad.coordTo--;
    }
  } else if(val == 'DOWN') {
    if(pad.coordTo < height-1) {
      pad.coordFrom++;
      pad.coordTo++;
    }
  } else {
    // An y coord is given
    if(val < Math.floor(pad.size/2)) {
      pad.coordFrom = 0;
      pad.coordTo = pad.size - 1;
    } else if(val > height - 1 - Math.floor(pad.size/2)) {
      pad.coordFrom = height - pad.size;
      pad.coordTo = height - 1;
    } else {
      pad.coordFrom = val - Math.floor(pad.size/2);
      pad.coordTo = val + Math.floor(pad.size/2);
    }

  }
  drawScreen(width, height, padA, padB, ball);
}

// Accepts paddle A, paddle B and move function
function setupControllers(padA, padB, movePaddle) {
  term.grabInput({ mouse: 'motion' });
  term.on('key', function(name, matches, data) {
     if(name == 'CTRL_C') process.exit();
    if(ball.dirX == 'LEFT') {
      switch(name) {
        case 'W': return movePaddle(padA, 'UP');
        case 'S': return movePaddle(padA, 'DOWN');
      }
    } else {
      switch(name) {
        case 'UP': return movePaddle(padB, 'UP');
        case 'DOWN': return movePaddle(padB, 'DOWN');
      }
    }
  });
  term.on('mouse', function(name, data) {
    movePaddle(padB, data.y);
  });
  /*
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
  */
}


// Draws everything to screen
function drawScreen(width, height, padA, padB, ball) {
  term.clear();
  var out = '';
  var title: string = padA.score + ':' + padB.score;
  term(padStart(title, width/ 2 - 6) + '\n');
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
  term(out);
}

// JS String.prototpye.padStart implementation in Node
function padStart(str, count) {
  for(let i = 0; i < count; i++) {
    str = ' ' + str;
  }
  return str;
}
