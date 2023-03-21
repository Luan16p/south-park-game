'use strict'
// game constants

const GRAVITY = .5;
const JUMP_FORCE = 20;
const GROUND_HEIGHT = 30;
const OBSTACLE_HEIGHT = 60;
const OBSTACLE_WIDTH = 60;
var OBSTACLE_INTERVAL = [20, 100, 80, 60, 80, 90, 120, 30, 200, 50];

// canvas
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

var audio = document.getElementById('die-song');
var audio_jump = document.getElementById('jump')

let dinoImg = document.getElementById("dino-img");
let obstacleImg = document.getElementById("obstacle-img");

// game variables
let dino = {
  x: 40,
  y: canvas.height - GROUND_HEIGHT,
  width: 50,
  height: 50,
  yVelocity: 0,
  jumping: false,
};

let obstacles = [];
let score = 0;
let obstacleGenerationCounter = 0;
let gameLoop;

// functions

function drawDino() {

  ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}

function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
      }
}

function drawGround() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function jump() {
    if (!dino.jumping) {
        dino.jumping = true;
        audio_jump.play();
        dino.yVelocity = JUMP_FORCE;
        let jumpAnimation = setInterval(() => {
          if (dino.y + dino.height <= canvas.height - GROUND_HEIGHT) {
            dino.y -= dino.yVelocity;
            dino.yVelocity -= GRAVITY;
          } else {
            dino.y = canvas.height - GROUND_HEIGHT - dino.height;
            dino.jumping = false;
            clearInterval(jumpAnimation);
          }
        }, 10);
      }
}

function applyGravity() {
    if (!dino.jumping) {
        if (dino.y + dino.height < canvas.height - GROUND_HEIGHT) {
          dino.yVelocity += GRAVITY;
          dino.y += dino.yVelocity;
        } else {
          dino.yVelocity = 0;
          dino.y = canvas.height - GROUND_HEIGHT - dino.height;
        }
      }
}

function checkCollisions() {
  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];
    if (
      dino.x < obstacle.x + OBSTACLE_WIDTH &&
      dino.x + dino.width > obstacle.x &&
      dino.y < obstacle.y + OBSTACLE_HEIGHT &&
      dino.y + dino.height > obstacle.y
    ) {
      clearInterval(gameLoop);


      audio.currentTime = 3;
      audio.play(); // Oh não, mataram o Kenny!
      startGame()
    }
  }
}

function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw game objects
  drawDino();
  drawObstacles();
  drawGround();
  drawScore();

  // update game variables
  applyGravity();
  checkCollisions();
  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];
    obstacle.x -= 5;
    if (obstacle.x + OBSTACLE_WIDTH < 0) {
      obstacles.splice(i, 1);
      i--;
      score++;
    }
  }
}

function startGame() {
    // initialize game variables
    dino = {
      x: 50,
      y: canvas.height - GROUND_HEIGHT,
      width: 50,
      height: 50,
      yVelocity: 0,
      jumping: false,
    };
    obstacles = [];
    score = 0;
    obstacleGenerationCounter = 0;
    
    document.addEventListener("keydown", (e) => {
        let code = e.code;
      
        if (code === "ArrowUp" || code == "Space") {
          jump();
        }
    });

    canvas.addEventListener('click', jump);
    canvas.addEventListener('focus', jump);

    // start game loop
    gameLoop = setInterval(function() {
      // generate obstacles
      obstacleGenerationCounter++;
      if (obstacleGenerationCounter === Math.floor(Math.random() * OBSTACLE_INTERVAL.length)) {
        obstacles.push({
          x: canvas.width,
          y: canvas.height - GROUND_HEIGHT - OBSTACLE_HEIGHT + 5,
        });
        obstacleGenerationCounter = 0;
      }
      
      // draw game objects and update game variables
      draw();
    }, 1000 / 60); // 60 frames per second
  }
startGame();