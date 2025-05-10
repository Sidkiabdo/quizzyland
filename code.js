let currentQuestion = 0;
let score = 0;
let questions = [];

const codePre = document.getElementById("code");
const optionsDiv = document.getElementById("options");
const resultDiv = document.getElementById("result");
const nextButton = document.getElementById("next");
const quizContainer = document.querySelector(".quiz-container");
const liveScore = document.getElementById("live-score");


// Crée dynamiquement l'écran de fin
const endScreen = document.createElement("div");
endScreen.id = "end-screen";
endScreen.style.display = "none";

const finalScore = document.createElement("p");
finalScore.id = "final-score";

const restartButton = document.createElement("button");
restartButton.id = "restart";
restartButton.textContent = "Rejouer";

endScreen.appendChild(finalScore);
endScreen.appendChild(restartButton);
document.body.appendChild(endScreen);

// Charger les questions depuis le fichier JSON
fetch("data_code.json")
  .then(response => response.json())
  .then(data => {
    questions = data;
    loadQuestion();
  })
  .catch(error => {
    console.error("Erreur de chargement des questions :", error);
    resultDiv.textContent = "Impossible de charger les questions.";
  });

function loadQuestion() {
    const q = questions[currentQuestion];
    document.querySelector("p").textContent = q.question;
    codePre.textContent = q.code;
    optionsDiv.innerHTML = "";
    resultDiv.textContent = "";

    const options = [q.answer1, q.answer2, q.answer3, q.answer4];
    options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(button, option, q.reponse);
        optionsDiv.appendChild(button);
    });

    nextButton.disabled = true;
}

function checkAnswer(button, selected, correct) {
    const buttons = optionsDiv.querySelectorAll("button");
    buttons.forEach(btn => btn.disabled = true);

    if (selected === correct) {
        resultDiv.textContent = "Correct !";
        resultDiv.style.color = "green";
        score++;
        liveScore.textContent = `Score : ${score}`; // 🔥 Mise à jour ici
    } else {
        resultDiv.textContent = `Incorrect. La réponse était "${correct}".`;
        resultDiv.style.color = "red";
    }

    nextButton.disabled = false;
}


nextButton.onclick = () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
};

function endQuiz() {
    quizContainer.style.display = "none";
    endScreen.style.display = "block";
    finalScore.textContent = `Votre score final est ${score} / ${questions.length}`;
}

restartButton.onclick = () => {
    currentQuestion = 0;
    score = 0;
    endScreen.style.display = "none";
    quizContainer.style.display = "block";
    loadQuestion();
};
