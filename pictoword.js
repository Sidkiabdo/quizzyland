
    let pictowords = [];
    let currentQuestion = 0;
    let score = 0;

    const image1 = document.getElementById("image1");
    const image2 = document.getElementById("image2");
    const answerInput = document.getElementById("answer");
    const resultDiv = document.getElementById("result");
    const submitButton = document.getElementById("submit");
    const nextButton = document.getElementById("next");

    async function loadPictowords() {
        try {
            const response = await fetch("data_pictoword.json");
            if (!response.ok) throw new Error("Erreur de chargement du fichier JSON.");

            const data = await response.json();
                console.log(data); 

            pictowords = data.map(item => ({
    img1: item.imag1 ? item.imag1.replace(/\\/g, "/") : "",
    img2: item.imag2 ? item.imag2.replace(/\\/g, "/") : "",
    answer: item.answer || ""
}));


            loadQuestion();
        } catch (error) {
            resultDiv.textContent = "Erreur : " + error.message;
            resultDiv.style.color = "red";
        }
    }

    function loadQuestion() {
        if (currentQuestion >= pictowords.length) {
            endQuiz();
            return;
        }

        const pw = pictowords[currentQuestion];
        image1.src = pw.img1;
        image2.src = pw.img2;
        image1.alt = "Image 1 pour " + pw.answer;
        image2.alt = "Image 2 pour " + pw.answer;
        answerInput.value = "";
        resultDiv.textContent = "";
        answerInput.focus();
    }

    function checkAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const correctAnswer = pictowords[currentQuestion].answer.toLowerCase();

        if (userAnswer === correctAnswer) {
            resultDiv.textContent = "Correct !";
            resultDiv.style.color = "green";
            score++;
        } else {
            resultDiv.textContent = `Incorrect. La réponse était "${correctAnswer}".`;
            resultDiv.style.color = "red";
        }
    }

    function endQuiz() {
        image1.style.display = "none";
        image2.style.display = "none";
        answerInput.style.display = "none";
        submitButton.style.display = "none";
        nextButton.style.display = "none";
        resultDiv.innerHTML = `
            <h3>Quiz Terminé !</h3>
            <p>Votre score final : ${score}/${pictowords.length}</p>
            <p>${getFinalMessage()}</p>
            <button onclick="window.location.reload()">Rejouer</button>
        `;
    }

    function getFinalMessage() {
        const percentage = (score / pictowords.length) * 100;
        if (percentage >= 80) return "Excellent ! Vous êtes un pro des PictoWords !";
        if (percentage >= 60) return "Bien joué ! Vous avez une bonne intuition.";
        if (percentage >= 40) return "Pas mal ! Vous pouvez encore progresser.";
        return "Continuez à vous entraîner !";
    }

    submitButton.addEventListener("click", checkAnswer);
    nextButton.addEventListener("click", () => {
        currentQuestion++;
        loadQuestion();
    });

    loadPictowords();
