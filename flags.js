let currentQuestion = 0;
let score = 0;
let flags = []; // Stockera les données chargées
const flagImg = document.getElementById("flag");
const optionsDiv = document.getElementById("options");
const resultDiv = document.getElementById("result");
const nextButton = document.getElementById("next");
const scoreDisplay = document.getElementById("score");
const totalQuestionsDisplay = document.getElementById("total");

// Charger les données depuis flags.json
async function loadFlags() {
    try {
        const response = await fetch('data_flags.json');
        if (!response.ok) {
            throw new Error('Erreur de chargement des données');
        }
        flags = await response.json();
        totalQuestionsDisplay.textContent = flags.length;
        loadQuestion();
    } catch (error) {
        resultDiv.textContent = "Erreur: " + error.message;
        resultDiv.style.color = "red";
    }
}

function loadQuestion() {
    if (currentQuestion >= flags.length) {
        endQuiz();
        return;
    }

    const flag = flags[currentQuestion];
    flagImg.src = flag.name;
    flagImg.alt = `Drapeau de ${flag.correct_answer}`;
    optionsDiv.innerHTML = "";

    // Créer un tableau de toutes les réponses et les mélanger
    const allAnswers = [
        flag.answer_1,
        flag.answer_2,
        flag.answer_3,
        flag.answer_4
    ].sort(() => Math.random() - 0.5);

    allAnswers.forEach(option => {
        const button = document.createElement("button");
        button.className = "option";
        button.textContent = option.trim();
        button.onclick = () => checkAnswer(option, flag.correct_answer);
        optionsDiv.appendChild(button);
    });

    resultDiv.textContent = "";
    nextButton.style.display = "none";
}

function checkAnswer(selected, correct) {
    // Désactiver tous les boutons
    document.querySelectorAll('.option').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct) {
            btn.style.backgroundColor = "#4CAF50";
        } else if (btn.textContent === selected && selected !== correct) {
            btn.style.backgroundColor = "#f44336";
        }
    });

    if (selected === correct) {
        resultDiv.textContent = "Correct !";
        resultDiv.style.color = "green";
        score++;
        scoreDisplay.textContent = score;
    } else {
        resultDiv.textContent = `Incorrect. La réponse était ${correct}.`;
        resultDiv.style.color = "red";
    }

    nextButton.style.display = "block";
}

function endQuiz() {
    flagImg.style.display = "none";
    optionsDiv.innerHTML = "";
    resultDiv.innerHTML = `
        <h3>Quiz Terminé !</h3>
        <p>Votre score final: ${score}/${flags.length}</p>
        <p>${getFinalMessage()}</p>
    `;
    
    // Bouton Retour au Menu
    const menuBtn = document.createElement("button");
    menuBtn.textContent = "Retour au Menu";
    menuBtn.className = "menu-btn";
    menuBtn.onclick = () => window.location.href = "index.html";
    optionsDiv.appendChild(menuBtn);
}

function getFinalMessage() {
    const percentage = (score / flags.length) * 100;
    if (percentage >= 80) return "Excellent ! Vous êtes un expert en drapeaux !";
    if (percentage >= 60) return "Bien joué ! Vous connaissez bien vos drapeaux.";
    if (percentage >= 40) return "Pas mal ! Vous pouvez encore progresser.";
    return "Continuez à apprendre, vous allez vous améliorer !";
}

// Gestion du bouton Suivant
nextButton.addEventListener("click", () => {
    currentQuestion++;
    loadQuestion();
});

// Démarrer le quiz
loadFlags();