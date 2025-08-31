const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const lettersEl = document.getElementById('letters');
const lifesEl = document.getElementById('lifes');
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');

let questions = [];
let answer = '';
let display = [];
let lifes = 6;
let used = new Set();
let gameOver = false;

function fetchQuestions() {
  fetch('http://codeapi.net.cws18.my-hosting-panel.com/hangman.php')
    .then(res => res.json())
    .then(data => {
      questions = data;
      startGame();
    })
    .catch(() => {
      questionEl.textContent = 'Error fetching questions.';
    });
}

function startGame() {
  messageEl.textContent = '';
  resetBtn.style.display = 'none';
  lifes = 6;
  used.clear();
  gameOver = false;
  const q = questions[Math.floor(Math.random() * questions.length)];
  questionEl.textContent = q.Question;
  answer = q.Answer.toUpperCase();
  display = Array.from(answer).map(ch => (ch === ' ' ? ' ' : '_'));
  renderAnswer();
  renderLetters();
  renderLifes();
}

function renderAnswer() {
  answerEl.textContent = display.join(' ');
}

function renderLetters() {
  lettersEl.innerHTML = '';
  for (let i = 65; i <= 90; i++) {
    const ch = String.fromCharCode(i);
    const btn = document.createElement('button');
    btn.textContent = ch;
    btn.disabled = used.has(ch) || gameOver;
    btn.onclick = () => handleLetter(ch);
    lettersEl.appendChild(btn);
  }
}

function renderLifes() {
  lifesEl.textContent = `Lifes: ${lifes}`;
}

function handleLetter(ch) {
  if (gameOver || used.has(ch)) return;
  used.add(ch);
  let found = false;
  for (let i = 0; i < answer.length; i++) {
    if (answer[i] === ch) {
      display[i] = ch;
      found = true;
    }
  }
  if (!found) {
    lifes--;
    renderLifes();
    if (lifes === 0) {
      messageEl.textContent = `Game Over! The answer was: ${answer}`;
      gameOver = true;
      resetBtn.style.display = 'inline-block';
    }
  } else {
    renderAnswer();
    if (display.join('') === answer) {
      messageEl.textContent = 'Congratulations! You have won!';
      gameOver = true;
      resetBtn.style.display = 'inline-block';
    }
  }
  renderLetters();
}

resetBtn.onclick = function() {
  startGame();
};

fetchQuestions();
