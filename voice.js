const dictionary = [
    { en: "Bread", es: "Pan" }, { en: "Water", es: "Agua" }, { en: "Milk", es: "Leche" },
    { en: "Cheese", es: "Queso" }, { en: "Apple", es: "Manzana" }, { en: "Meat", es: "Carne" },
    { en: "Dog", es: "Perro" }, { en: "Cat", es: "Gato" }, { en: "Bird", es: "Pájaro" },
    { en: "House", es: "Casa" }, { en: "Car", es: "Coche" }, { en: "Book", es: "Libro" },
    { en: "Red", es: "Rojo" }, { en: "Blue", es: "Azul" }, { en: "Green", es: "Verde" },
    { en: "Yellow", es: "Amarillo" }, { en: "Black", es: "Negro" }, { en: "White", es: "Blanco" },
    { en: "Hello", es: "Hola" }, { en: "Goodbye", es: "Adiós" }, { en: "Thank you", es: "Gracias" }
];

let score = 0, streak = 0, questionCount = 0;
const maxQuestions = 20;
let currentQuestionData = {};

const questionEl = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const scoreEl = document.querySelector("#score-display span");
const streakEl = document.querySelector("#streak-display span");
const streakDisplay = document.getElementById("streak-display");
const startBtn = document.getElementById("start-btn");
const progressBar = document.getElementById("progress-bar");

startBtn.addEventListener("click", startQuiz);

// Keyboard Support
window.addEventListener("keydown", (e) => {
    const btn = optionsContainer.querySelectorAll("button")[parseInt(e.key) - 1];
    if (btn && btn.style.pointerEvents !== "none") btn.click();
});

function startQuiz() {
    startBtn.style.display = "none";
    score = 0; streak = 0; questionCount = 0;
    updateStats();
    generateQuestion();
}

function generateQuestion() {
    optionsContainer.innerHTML = "";
    questionCount++;
    const target = dictionary[Math.floor(Math.random() * dictionary.length)];
    const options = new Set([target.es]);
    while(options.size < 4) options.add(dictionary[Math.floor(Math.random() * dictionary.length)].es);

    currentQuestionData = { q: `How do you say '${target.en}'?`, a: target.es, options: [...options].sort(() => Math.random() - 0.5) };
    
    progressBar.style.width = `${(questionCount / maxQuestions) * 100}%`;
    typeWriter(currentQuestionData.q, questionEl);
    speak(currentQuestionData.q, 'en-US');

    currentQuestionData.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.innerHTML = `<span style="opacity:0.5; font-size:0.8rem;">[${i+1}]</span> ${opt}`;
        btn.onclick = () => checkAnswer(opt, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(choice, btn) {
    document.querySelectorAll("#options-container button").forEach(b => b.style.pointerEvents = "none");
    if (choice === currentQuestionData.a) {
        score++; streak++;
        btn.classList.add("correct-anim");
        speak("¡Correcto!", 'es-ES');
    } else {
        streak = 0;
        btn.classList.add("wrong-anim");
        speak("Incorrecto. Es " + currentQuestionData.a, 'es-ES');
    }
    updateStats();
    setTimeout(() => questionCount < maxQuestions ? generateQuestion() : endQuiz(), 2500);
}

function updateStats() {
    scoreEl.innerText = score;
    streakEl.innerText = streak;
    streak >= 3 ? streakDisplay.classList.add("hot-streak") : streakDisplay.classList.remove("hot-streak");
}

function endQuiz() {
    questionEl.innerText = `Final Score: ${score}/${maxQuestions}`;
    optionsContainer.innerHTML = "";
    startBtn.innerText = "RESTART";
    startBtn.style.display = "inline-block";
}

function typeWriter(text, el) {
    el.innerText = ""; let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) el.append(text[i++]);
        else clearInterval(interval);
    }, 30);
}

function speak(text, lang) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    const voice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith(lang.split('-')[0]));
    if (voice) msg.voice = voice;
    window.speechSynthesis.speak(msg);
}