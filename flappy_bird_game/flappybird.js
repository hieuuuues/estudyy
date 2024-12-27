let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

// Pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

// Quiz
let quiz = document.getElementById("quiz");
let question = document.getElementById("question");
let correctAnswer;
let questions = [
  {
    q: "Hiếu có đẹp trai ko?",
    options: { A: "quá ok luôn", B: "chắn chắn rồi", C: "yes", D: "có" },
    correct: "B",
  },
  {
    q: "li min ho là ai",
    options: { A: "Hiếu", B: "Đào Hiếu", C: "Hiếu Đào ", D: "Đào Trung Hiếu" },
    correct: "A",
  },
];

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  birdImg = new Image();
  birdImg.src = "./flappybird.png";

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);

  // Add event listeners for quiz answers
  document.querySelectorAll(".answer").forEach((button) => {
    button.addEventListener("click", checkAnswer);
  });
};

function update() {
  if (gameOver) return;
  requestAnimationFrame(update);

  context.clearRect(0, 0, board.width, board.height);

  // Bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
    showQuiz();
  }

  // Pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
      showQuiz();
    }
  }

  // Clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  // Score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);
}

function placePipes() {
  if (gameOver) return;

  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    velocityY = -6;

    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      velocityY = 0;
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function showQuiz() {
  let randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  question.textContent = randomQuestion.q;
  correctAnswer = randomQuestion.correct;

  let buttons = document.querySelectorAll(".answer");
  let options = randomQuestion.options;
  buttons.forEach((button) => {
    button.textContent = `${button.getAttribute("data-answer")}: ${
      options[button.getAttribute("data-answer")]
    }`;
  });

  quiz.style.display = "block";
}

function checkAnswer(e) {
  if (e.target.getAttribute("data-answer") === correctAnswer) {
    // Trả lời đúng: Tiếp tục, không reset điểm
    quiz.style.display = "none";
    resetGame(false);
  } else {
    // Trả lời sai: Reset điểm
    quiz.style.display = "none";
    resetGame(true);
  }
}

function resetGame(resetScore) {
  bird.y = birdY;
  pipeArray = [];
  velocityY = 0;
  gameOver = false;
  if (resetScore) score = 0;
  requestAnimationFrame(update);
}
document.getElementById("backButton").addEventListener("click", function () {
  // Logic xử lý khi nhấn nút Back
  // Ví dụ: Chuyển về trang chủ
  window.location.href = "GAME.html"; // Thay "index.html" bằng trang bạn muốn chuyển đến.
});
