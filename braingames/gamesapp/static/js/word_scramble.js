const wordList = [
  'apple', 'banana', 'grape', 'orange', 'peach', 'melon', 'kiwi', 'plum', 'mango', 'pear',
  'lemon', 'lime', 'apricot', 'avocado', 'blueberry', 'blackberry', 'cherry', 'coconut', 'fig', 'guava',
  'jackfruit', 'lychee', 'mandarin', 'nectarine', 'papaya', 'passionfruit', 'persimmon', 'pineapple', 'pomegranate', 'raspberry',
  'strawberry', 'tangerine', 'watermelon', 'cucumber', 'carrot', 'pumpkin', 'tomato', 'potato', 'onion', 'garlic',
  'radish', 'turnip', 'broccoli', 'cauliflower', 'spinach', 'lettuce', 'beetroot', 'zucchini', 'peas', 'corn'
];

let selectedWords = [];
let currentWordIndex = 0;
let currentScrambled = '';
let attempts = 0;
let score = 0;

function selectWords() {
  selectedWords = [];
  const copy = [...wordList];
  while (selectedWords.length < 5) {
    const randIndex = Math.floor(Math.random() * copy.length);
    selectedWords.push(copy.splice(randIndex, 1)[0]);
  }
}

function scrambleWord(word) {
  let arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

function showWord() {
  if (currentWordIndex >= selectedWords.length) {
    endGame();
    return;
  }

  currentScrambled = scrambleWord(selectedWords[currentWordIndex]);
  document.getElementById('scrambledWord').textContent = currentScrambled;
  document.getElementById('guessInput').value = '';
  document.getElementById('message').textContent = `Word ${currentWordIndex + 1} of 5`;
  document.getElementById('correctAnswer').textContent = '';
  document.getElementById('guessInput').focus();
}

function checkGuess() {
  const guess = document.getElementById('guessInput').value.trim().toLowerCase();
  const correct = selectedWords[currentWordIndex].toLowerCase();
  attempts++;

  if (guess === correct) {
    score++;
    currentWordIndex++;
    showWord();
  } else {
    document.getElementById('correctAnswer').innerHTML = `❌ Wrong! The correct word was: <strong>${correct}</strong>`;
    setTimeout(() => {
      currentWordIndex++;
      showWord();
    }, 2000);
  }
}

function endGame() {
  if (confirm(`🎉 Game Over! You got ${score} out of 5 correct.\nLogin to save your score.`)) {
    const scoreData = { game: "Word Scramble", score: score };
    localStorage.setItem('pending_score', JSON.stringify(scoreData));
    window.location.href = "/signup/";
  } else {
    document.getElementById('message').textContent = 'You can restart the game or login anytime.';
  }
}

window.onload = () => {
  selectWords();
  showWord();

  document.getElementById('submitBtn').onclick = checkGuess;
  document.getElementById('guessInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkGuess();
  });

  document.getElementById('restartBtn').onclick = () => {
    attempts = 0;
    score = 0;
    currentWordIndex = 0;
    selectWords();
    showWord();
  };
};
