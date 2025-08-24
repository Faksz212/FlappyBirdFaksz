const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

// Load assets
const birdImg = new Image();
birdImg.src = "bird.gif"; // burung animasi gif/png

const bgImg = new Image();
bgImg.src = "bg.png"; // background langit

let bird, pipes, score, highScore, frame, started, gameOver;

function resetGame() {
  bird = { x: 50, y: 150, w: 34, h: 24, gravity: 0.6, lift: -10, velocity: 0 };
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
  scoreEl.textContent = score;
}

function init() {
  highScore = localStorage.getItem("flappyHighScore") || 0;
  highScoreEl.textContent = highScore;
  started = false;
  gameOver = false;
  resetGame();
  requestAnimationFrame(gameLoop);
}

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.w, bird.h);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(p => {
    // top pipe
    ctx.fillRect(p.x, 0, p.w, p.top);
    ctx.strokeStyle = "#004d00";
    ctx.strokeRect(p.x, 0, p.w, p.top);

    // bottom pipe
    ctx.fillRect(p.x, canvas.height - p.bottom, p.w, p.bottom);
    ctx.strokeRect(p.x, canvas.height - p.bottom, p.w, p.bottom);
  });
}

function update() {
  if (!started || gameOver) return;

  // Bird physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.h > canvas.height) {
    endGame();
  }

  // Pipes
  if (frame % 90 === 0) {
    let gap = 120;
    let top = Math.random() * (canvas.height - gap - 100) + 20;
    pipes.push({ x: canvas.width, w: 50, top: top, bottom: canvas.height - top - gap });
  }

  pipes.forEach(p => {
    p.x -= 2;

    // Collision
    if (
      bird.x < p.x + p.w &&
      bird.x + bird.w > p.x &&
      (bird.y < p.top || bird.y + bird.h > canvas.height - p.bottom)
    ) {
      endGame();
    }

    // Score
    if (p.x + p.w === bird.x) {
      score++;
      scoreEl.textContent = score;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("flappyHighScore", highScore);
        highScoreEl.textContent = highScore;
      }
    }
  });

  pipes = pipes.filter(p => p.x + p.w > 0);

  frame++;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height); // background
  drawBird();
  drawPipes();

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "24px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 60, canvas.height / 2);
    startBtn.style.display = "block";
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameOver = true;
  started = false;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && started && !gameOver) {
    bird.velocity = bird.lift;
  }
});

canvas.addEventListener("click", () => {
  if (started && !gameOver) {
    bird.velocity = bird.lift;
  }
});

startBtn.addEventListener("click", () => {
  resetGame();
  started = true;
  gameOver = false;
  startBtn.style.display = "none";
});

init();
                   
