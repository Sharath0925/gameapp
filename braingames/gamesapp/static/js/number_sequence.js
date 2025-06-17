const allSequences = [
  { sequence: [2, 4, 6, 8], answer: 10, type: "next" },
  { sequence: [1, 1, 2, 3, 5], answer: 8, type: "next" },
  { sequence: [5, 10, 15, 20], answer: 25, type: "next" },
  { sequence: [81, 27, 9, 3], answer: 1, type: "next" },
  { sequence: [2, 3, 5, 7, 11], answer: 13, type: "next" },
  { sequence: [3, 6, 9, 12], answer: 15, type: "next" },
  { sequence: [1, 2, 4, 8], answer: 16, type: "next" },
  { sequence: [1, 4, 9, 16], answer: 25, type: "next" },
  { sequence: [20, 18, 16, 14], answer: 12, type: "next" },
  { sequence: [2, 4, 3, 5, 4], answer: 6, type: "next" },
  { sequence: [10, 20, 30, 40], answer: 50, type: "next" },
  { sequence: [1, 3, 6, 10], answer: 15, type: "next" },
  { sequence: [2, 6, 18, 54], answer: 162, type: "next" },
  { sequence: [100, 90, 80, 70], answer: 60, type: "next" },
  { sequence: [1, 1, 2, 6, 24], answer: 120, type: "next" },
  { sequence: [5, 4, 6, 5, 7], answer: 6, type: "next" },
  { sequence: [3, 5, 7, 9], answer: 11, type: "next" },
  { sequence: [2, 5, 10, 17], answer: 26, type: "next" },
  { sequence: [7, 14, 28, 56], answer: 112, type: "next" },
  { sequence: [2, 8, 18, 32], answer: 50, type: "next" },
  { sequence: [1, 3, "__", 7], answer: 5, type: "missing" },
  { sequence: [5, "__", 15, 20], answer: 10, type: "missing" },
  { sequence: [1, "__", 2, 3, 5], answer: 1, type: "missing" },
  { sequence: [2, 6, "__", 54], answer: 18, type: "missing" },
  { sequence: [2, 3, 6, "__", 18], answer: 11, type: "missing" },
  { sequence: [13, 26, "__", 104], answer: 52, type: "missing" },
  { sequence: [1, 8, 27, "__"], answer: 64, type: "missing" },
  { sequence: [5, "__", 20, 40], answer: 10, type: "missing" },
  { sequence: [1, "__", 6, 10], answer: 3, type: "missing" },
  { sequence: [4, 7, "__", 18], answer: 11, type: "missing" }
  
];

const QUESTION_COUNT = 5;
let sequences = [];
let currentIndex = 0;
let score = 0;

const sequenceDisplay = document.getElementById("sequenceDisplay");
const guessInput = document.getElementById("guessInput");
const message = document.getElementById("message");
const correctAnswerDisplay = document.getElementById("correctAnswer");
const submitBtn = document.getElementById("submitBtn");
const restartBtn = document.getElementById("restartBtn");

function shuffleArray(arr) {
  const array = arr.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function pickRandomQuestions() {
  const shuffled = shuffleArray(allSequences);
  return shuffled.slice(0, QUESTION_COUNT);
}

function loadSequence() {
  if (!sequences.length) return;
  const current = sequences[currentIndex];
  const displaySeq = current.sequence.map(item => item === "__" ? "__" : item);
  sequenceDisplay.textContent = displaySeq.join(", ");
  guessInput.value = "";
  message.textContent = `Question ${currentIndex + 1} of ${sequences.length} (${current.type === "missing" ? "Fill the missing number" : "Guess the next number"})`;
  correctAnswerDisplay.textContent = "";
}

function submitAnswer() {
  if (!sequences.length) return;
  const userGuess = parseInt(guessInput.value.trim());
  if (isNaN(userGuess)) {
    message.textContent = "Please enter a valid number!";
    return;
  }

  const correct = sequences[currentIndex].answer;

  if (userGuess === correct) {
    score++;
    message.textContent = "✅ Correct!";
    correctAnswerDisplay.textContent = "";
  } else {
    message.textContent = "❌ Wrong!";
    correctAnswerDisplay.textContent = `Correct answer: ${correct}`;
  }

  currentIndex++;

  setTimeout(() => {
    if (currentIndex < sequences.length) {
      loadSequence();
    } else {
      const userConfirmed = confirm(`🎉 Game Over! You got ${score} out of ${sequences.length}.\nLogin to save your score.`);
      const scoreData = {
        game: "Number Sequence",
        score: score
      };
      localStorage.setItem("pending_score", JSON.stringify(scoreData));
      if (userConfirmed) {
        window.location.href = "/signup/";
      } else {
        message.textContent = "You can restart the game or login anytime.";
      }
    }
  }, 1500);
}

function restartGame() {
  currentIndex = 0;
  score = 0;
  sequences = pickRandomQuestions();
  loadSequence();
  message.textContent = "";
  correctAnswerDisplay.textContent = "";
}

submitBtn.addEventListener("click", submitAnswer);
restartBtn.addEventListener("click", restartGame);

window.onload = () => {
  sequences = pickRandomQuestions();
  loadSequence();
};
