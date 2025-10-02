const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');

const loader = document.getElementById('loader')
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswes = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
let userAnswers = []; // armazenar respostas do usuário

const CORRECT_BONUS = 1; // +1 por acerto
const MAX_QUESTIONS = 32;

// Buscar perguntas do JSON
fetch("questions.json")
.then(res => res.json())
.then(loadedQuestions => {
    questions = loadedQuestions.map(q => {
        const formattedQuestion = { question: q.question };

        const answerChoices = [q.choice1, q.choice2, q.choice3, q.choice4];
        if(q.choice5) answerChoices.push(q.choice5);

        formattedQuestion.answer = q.answer;

        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index + 1)] = choice;
        });

        return formattedQuestion;
    });

    startGame();
})
.catch(err => console.log(err));

// Iniciar o jogo
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];

    getNewQuestions();

    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

// Obter nova questão
getNewQuestions = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
        return window.location.assign('end.html');
    }

    questionCounter++;
    progressText.innerText = `Progresso: ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        const text = currentQuestion["choice" + number];
        if(text){
            choice.innerText = text;
            choice.parentElement.style.display = 'flex';
        } else {
            choice.parentElement.style.display = 'none'; // oculta se não tiver choice5
        }
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswes = true;
};

// Click nas escolhas
choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswes) return;

        acceptingAnswes = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        const correctAnswer = currentQuestion.answer;

        // Salvar resposta do usuário
        userAnswers.push({
            question: currentQuestion.question,
            selected: selectedAnswer,
            correct: correctAnswer,
            choice1: currentQuestion.choice1,
            choice2: currentQuestion.choice2,
            choice3: currentQuestion.choice3,
            choice4: currentQuestion.choice4,
            choice5: currentQuestion.choice5
        });

        const classToApply = selectedAnswer == correctAnswer ? 'correct' : 'incorrect';
        if(classToApply === 'correct') incrementScore(CORRECT_BONUS);

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestions();
        }, 1000);
    });
});

// Incrementar score
incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};
