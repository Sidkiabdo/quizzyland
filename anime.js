// Variables globales
let questions = [];
let currentQuestion = 0;
let score = 0;
const animeImg = document.getElementById("anime"); // Changé de characterImg à animeImg
const optionsDiv = document.getElementById("options");
const resultDiv = document.getElementById("result");
const nextButton = document.getElementById("next");
const scoreSpan = document.getElementById("score");
const totalSpan = document.getElementById("total");
const loadingDiv = document.getElementById("loading");

// Charger les questions depuis le fichier JSON
async function loadQuestions() {
    loadingDiv.style.display = "block";
    try {
        const response = await fetch('data_anime.json');
        if (!response.ok) {
            throw new Error('Erreur de chargement des questions');
        }
        questions = await response.json();
        totalSpan.textContent = questions.length;
        nextButton.style.display = "none";
        loadQuestion();
    } catch (error) {
        resultDiv.textContent = "Erreur: " + error.message;
        resultDiv.style.color = "red";
    } finally {
        loadingDiv.style.display = "none";
    }
}

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        endQuiz();
        return;
    }

    const question = questions[currentQuestion];
    document.querySelector("p").textContent = question.question;
    animeImg.src = question.photo; // Changé characterImg à animeImg
    animeImg.alt = "Personnage: " + question.correct_answer;
    
    optionsDiv.innerHTML = "";
    
    // Mélanger les réponses
    const answers = [
        question.answer_1,
        question.answer_2,
        question.answer_3,
        question.answer_4
    ].sort(() => Math.random() - 0.5);
    
    answers.forEach(answer => {
        const button = document.createElement("button");
        button.className = "option";
        button.textContent = answer;
        button.onclick = () => checkAnswer(answer, question.correct_answer);
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
        scoreSpan.textContent = score;
    } else {
        resultDiv.textContent = `Incorrect. La réponse était ${correct}.`;
        resultDiv.style.color = "red";
    }
    
    nextButton.style.display = "inline-block";
}

function endQuiz() {
    document.querySelector("p").textContent = "Quiz terminé !";
    animeImg.style.display = "none";
    optionsDiv.innerHTML = "";
    resultDiv.textContent = `Votre score final: ${score}/${questions.length}`;
    resultDiv.style.fontSize = "20px";
    nextButton.style.display = "none";
    
    // Créer le bouton Retour au menu
    const menuBtn = document.createElement("button");
    menuBtn.textContent = "Retour au menu";
    menuBtn.style.backgroundColor = "#26a69a"; // Style cohérent avec le thème
    menuBtn.onclick = () => {
        window.location.href = "index.html#quiz"; // Redirection vers la page d'accueil
    };
    optionsDiv.appendChild(menuBtn);
}

nextButton.addEventListener("click", () => {
    currentQuestion++;
    loadQuestion();
});

// Démarrer le quiz
loadQuestions();