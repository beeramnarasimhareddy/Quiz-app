const questions = {
  CSS: [
    
    {
      question: "How can you change the color of text in CSS?",
      answers: [
        { text: "text-color", correct: false },
        { text: "font-color", correct: false },
        { text: "color", correct: true },
        { text: "text-color", correct: false }
      ]
    },
    {
      question:"What is the purpose of the CSS property margin?",
      answers:[
        {text:"To control the spacing inside an element", correct:false},
        {text:"To control the spacing outside an element",correct:true},
        {text:"To change the background color",correct:false},
        {text:"To define the fonr size",correct:false}
      ]
    },
    {
      question: "Which CSS selector targets all <p> elements inside a <div> element?",
      answers: [
        { text: "div p", correct: true },
        { text: "p div", correct: false },
        { text: "p div", correct: false },
        { text: "pdiv", correct: false }
      ]
    },
    {
      question:"elements are position _____ by default",
      answers:[
        {text:"static",correct:true},
        {text:"fixed",correct:false},
        {text:"relative",correct:false},
        {text:"none",correct:false}
      ]
    }
  ],
  HTML: [
    {
      question: "Which attribute is used to specify the URL of an external CSS file in HTML?",
      answers: [
        { text: "Stylesheet", correct: false },
        { text: "link", correct: false },
        { text: "href", correct: true },
        { text: "all of the above", correct: false }
      ]
    },
    {
      question: "How many headers are there in HTML?",
      answers: [
        { text: "5", correct: false },
        { text: "4", correct: false },
        { text: "3", correct: false },
        { text: "6", correct: true }
      ]
    },
    {
      question:"What does HTML stand for?",
      answers:[
        {text:"Home tool Markup Language",correct:false},
        {text:"Hyper Text markup Language",correct:true},
        {text:"Hyperlinks and Text Markup Language",correct:false},
        {text:"HyperText language",correct:false}
      ]
    },
    {
      question:"Inline elements are normally displayed without starting a new line.",
      answers:[
        {text:"True",correct:true},
        {text:"False",correct:false}
      ]
    }
   
  ]
};

const questionElement = document.getElementById("question1");
const answerButtons = document.getElementById("answer-btn");
const nextButton = document.getElementById("next-btn");
const progressBar = document.getElementById('progress-bar');
const timerElement = document.getElementById('timer');
const categorySelect = document.getElementById("category");
const startQuizBtn = document.getElementById("start-quiz-btn");
const quizContainer = document.getElementById("quiz-container");

let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft;
let currentCategoryQuestions = [];

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 120;
  shuffleQuestions();
  nextButton.innerHTML = "Next";
  startTimer();
  updateProgressBar();
  showQuestion();
  quizContainer.style.display = 'block';
}

function startQuizFromCategory() {
  const selectedCategory = categorySelect.value;
  currentCategoryQuestions = questions[selectedCategory];
  startQuiz();
}

function shuffleQuestions() {
  for (let i = currentCategoryQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentCategoryQuestions[i], currentCategoryQuestions[j]] = [currentCategoryQuestions[j], currentCategoryQuestions[i]];
  }
}

function showQuestion() {
  resetState();
  updateProgressBar();
  const currentQuestion = currentCategoryQuestions[currentQuestionIndex];
  const questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = `${questionNo}. ${currentQuestion.question}`;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  nextButton.style.display = 'none';
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === 'true';
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }
  Array.from(answerButtons.children).forEach(button => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
}

function saveHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  highScores.push(score);
  highScores.sort((a, b) => b - a);
  localStorage.setItem('highScores', JSON.stringify(highScores.slice(0, 5))); // Store top 5 scores
}

function showScore() {
  resetState();
  questionElement.innerHTML = `You scored ${score} out of ${currentCategoryQuestions.length}`;
  saveHighScore(score);
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
  clearInterval(timerInterval);
}


function handleNextButton() {
  if (nextButton.innerHTML === "Play Again") {
    startQuizFromCategory(); 
  } else {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentCategoryQuestions.length) {
      showQuestion();
    } else {
      showScore();
    }
  }
}


function updateProgressBar() {
  const progressPercentage = ((currentQuestionIndex + 1) / currentCategoryQuestions.length) * 100;
  progressBar.style.width = `${progressPercentage}%`;
}

function startTimer() {
  timerInterval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timerElement.innerHTML = `Time Left: ${minutes}:${seconds}`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      showScore();
    }
  }, 1000);
}


startQuizBtn.addEventListener("click", startQuizFromCategory);
nextButton.addEventListener("click", handleNextButton);


quizContainer.style.display = 'none';
