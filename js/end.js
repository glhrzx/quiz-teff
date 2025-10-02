const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById('finalScore');
const resultsContainer = document.getElementById('results');

const mostRecentScore = localStorage.getItem('mostRecentScore');
const userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const MAX_HIGH_SCORES = 5;

// Mostrar pontuação final
finalScore.innerText = `Sua pontuação: ${mostRecentScore}`;

// Habilitar botão ao digitar nome
username.addEventListener("keyup", () =>{
    saveScoreBtn.disabled = !username.value;
});

// Função salvar score
saveHighScore = e => {
    e.preventDefault();

    const score = {
        score: Number(mostRecentScore),
        name: username.value
    };

    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(MAX_HIGH_SCORES);

    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.assign("highscores.html");
};

// Mostrar resultados detalhados
userAnswers.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('result-item');

    // Texto da escolha
    const selectedText = item.selected 
        ? item.selected + " - " + (item["choice" + item.selected] || "")
        : "Não respondida";

    const correctText = item.correct + " - " + (item["choice" + item.correct] || "");

    div.innerHTML = `
        <p><strong>Q${index + 1}:</strong> ${item.question}</p>
        <p>Sua resposta: <span class="${item.selected == item.correct ? 'correct-answer' : 'wrong-answer'}">${selectedText}</span></p>
        <p>Resposta correta: <span class="correct-answer">${correctText}</span></p>
    `;

    resultsContainer.appendChild(div);
});
