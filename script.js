const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

let bird, pipes, score, highScore, frame, gameOver, started;

// Suara
const soundJump = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
const soundCrash = new Audio("https://www.fesliyanstudios.com/play-mp3/6674");
const soundScore = new Audio("https://www.fesliyanstudios.com/play-mp3/6661");

function resetGame() {
  bird = { x: 50, y: 150, w: 25, h: 25, gravity: 0.6, lift: -10, velocity: 0 };
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
  started = false;
  scoreEl.textContent = score;
}

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(bird.x + bird.w / 2, bird.y + bird.h / 2, bird.w / 2, 0, Math.PI * 2);
  ctx.fill();

  // Mata
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(bird.x + 10, bird.y + 8, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawBackground() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Ground
  ctx.fillStyle = "#ded895";
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.w, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.w, pipe.bottom);
  });
}

function update() {
  if (!started || gameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.h > canvas.height - 50) {
    endGame();
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (
      bird.x < pipe.x + pipe.w &&
      bird.x + bird.w > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.h > canvas.height - pipe.bottom)
    ) {
      endGame();
    }

    if (!pipe.passed && pipe.x + pipe.w < bird.x) {
      score++;
      soundScore.play();
      pipe.passed = true;
      scoreEl.textContent = score;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("flappyHighScore", highScore);
        highScoreEl.textContent = highScore;
      }
    }
  });

  if (frame % 90 === 0) {
    let gap = 120;
    let top = Math.floor(Math.random() * (canvas.height - gap - 100)) + 20;
    let bottom = canvas.height - top - gap;
    pipes.push({ x: canvas.width, w: 40, top: top, bottom: bottom, passed: false });
  }
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);
}

function gameLoop() {
  frame++;
  drawBackground();
  drawPipes();
  drawBird();
  drawScore();
  update();
  requestAnimationFrame(gameLoop);
}

function endGame() {
  soundCrash.play();
  gameOver = true;
  startBtn.textContent = "↻ Restart";
  startBtn.style.display = "block";
}

document.addEventListener("keydown", () => {
  if (started && !gameOver) {
    bird.velocity = bird.lift;
    soundJump.play();
  }
});
canvas.addEventListener("touchstart", () => {
  if (started && !gameOver) {
    bird.velocity = bird.lift;
    soundJump.play();
  }
});

startBtn.addEventListener("click", () => {
  resetGame();
  started = true;
  startBtn.style.display = "none";
});

highScore = localStorage.getItem("flappyHighScore") || 0;
highScoreEl.textContent = highScore;

resetGame();
gameLoop();
