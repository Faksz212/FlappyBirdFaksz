const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

// Burung pakai gambar gif/png
const birdImg = new Image();
birdImg.src = "bird.gif"; // ganti sesuai file

let bird = { x: 50, y: 150, width: 34, height: 24, gravity: 0.6, lift: -10, velocity: 0 };
let pipes = [];
let score = 0;
let highScore = localStorage.getItem("flappyHighScore") || 0;
let frame = 0;
let gameLoop = null;
let started = false;

// update highscore awal
highScoreEl.textContent = highScore;

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  scoreEl.textContent = score;
  frame = 0;
}

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, 50, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, 50, p.bottom);
  });
}

function update() {
  frame++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // burung
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  drawBird();

  // tambah pipa tiap 100 frame
  if (frame % 100 === 0) {
    let top = Math.random() * (canvas.height / 2);
    let gap = 100;
    pipes.push({ x: canvas.width, top: top, bottom: canvas.height - top - gap });
  }

  // gerak pipa
  pipes.forEach(p => p.x -= 2);

  // hapus pipa keluar
  if (pipes.length && pipes[0].x < -50) pipes.shift();

  drawPipes();

  // cek tabrakan
  pipes.forEach(p => {
    if (bird.x < p.x + 50 &&
        bird.x + bird.width > p.x &&
        (bird.y < p.top || bird.y + bird.height > canvas.height - p.bottom)) {
      gameOver();
    }
  });

  // jatuh ke tanah
  if (bird.y + bird.height > canvas.height) {
    gameOver();
  }

  // tambah skor
  pipes.forEach(p => {
    if (p.x + 50 === bird.x) {
      score++;
      scoreEl.textContent = score;
    }
  });

  requestAnimationFrame(update);
}

function gameOver() {
  cancelAnimationFrame(gameLoop);
  started = false;
  startBtn.style.display = "block";

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("flappyHighScore", highScore);
    highScoreEl.textContent = highScore;
  }
}

canvas.addEventListener("click", () => {
  if (started) bird.velocity = bird.lift;
});

startBtn.addEventListener("click", () => {
  if (!started) {
    resetGame();
    started = true;
    startBtn.style.display = "none";
    update();
  }
});
                   
