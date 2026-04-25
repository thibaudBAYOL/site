/*Use of Manus (https://manus.im/app) for first code generation + quizz*/
const morseMap = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
    '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
    '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
    '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
    '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
    '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
    '---..': '8', '----.': '9', '/': ' '
};

const reverseMorseMap = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]));
const alphabet = Object.values(morseMap).filter(v => v !== ' ');

// --- Variables de saisie Morse ---
let pressStartTime;
let currentMorseWord = "";
let fullMorseMessage = "";
const LONG_PRESS_THRESHOLD = 250; // ms pour différencier court (.) de long (-)

// --- Variables de Quiz ---
let quizMode = null; // 'toMorse' ou 'toText'
let quizQueue = [];
let currentQuizItem = null;
let quizStats = {};

// --- Éléments DOM ---
const morseInputArea = document.getElementById('morse-input-area');
const textOutput = document.getElementById('text-output');
const textInput = document.getElementById('text-input');
const morseOutput = document.getElementById('morse-output');
const tapButton = document.getElementById('tap-button');
const tabMorse = document.getElementById('tabMorse');
// --- Initialisation ---
window.addEventListener('DOMContentLoaded', () => {
    loadStats();
    updateStatsDisplay();
});


for (const [key, value] of Object.entries(reverseMorseMap)) {

    const row = document.createElement("tr");

    const colMorse = document.createElement("td");
    colMorse.textContent = key;

    const colAlpha = document.createElement("td");
    colAlpha.textContent = value;

    row.appendChild(colMorse);
    row.appendChild(colAlpha);

    tabMorse.appendChild(row);
}
// --- Logique de saisie par clic ---
function handleStart(e) {
    if (e.cancelable) e.preventDefault();
    pressStartTime = Date.now();
    tapButton.classList.add('active');
}

function handleEnd(e) {
    if (e.cancelable) e.preventDefault();
    if (!pressStartTime) return;
    
    const duration = Date.now() - pressStartTime;
    const symbol = duration > LONG_PRESS_THRESHOLD ? '-' : '.';
    
    currentMorseWord += symbol;
    updateMorseDisplay();
    updateQuizMorseDisplay(symbol);
    translateMorseToText();
    
    pressStartTime = null;
    tapButton.classList.remove('active');
}

function updateQuizMorseDisplay(symbol) {
document.getElementById('quiz-answer-input').value += symbol;
}

function updateMorseDisplay() {
    morseInputArea.value = fullMorseMessage + (fullMorseMessage ? " " : "") + currentMorseWord;
}

function translateMorseToText() {
    const parts = morseInputArea.value.trim().split(/\s+/);
    const translated = parts.map(part => morseMap[part] || '?').join('');
    textOutput.value = translated;
}

// Boutons de contrôle Morse
document.getElementById('btn-space-char')?.addEventListener('click', () => {
    if (currentMorseWord) {
        fullMorseMessage += (fullMorseMessage ? " " : "") + currentMorseWord;
        currentMorseWord = "";
        updateMorseDisplay();
    }
});

document.getElementById('btn-space-word')?.addEventListener('click', () => {
    if (currentMorseWord) {
        fullMorseMessage += (fullMorseMessage ? " " : "") + currentMorseWord + " /";
    } else {
        fullMorseMessage += " /";
    }
    currentMorseWord = "";
    updateMorseDisplay();
    translateMorseToText();
});

document.getElementById('btn-clear-morse')?.addEventListener('click', () => {
    currentMorseWord = "";
    fullMorseMessage = "";
    morseInputArea.value = "";
    textOutput.value = "";
});
// Événements pour le bouton tactile/souris
tapButton.addEventListener('mousedown', handleStart);
tapButton.addEventListener('mouseup', handleEnd);
tapButton.addEventListener('touchstart', handleStart, { passive: false });
tapButton.addEventListener('touchend', handleEnd, { passive: false });

// --- Logique de traduction Texte vers Morse ---

textInput.addEventListener('input', () => {
    const text = textInput.value.toUpperCase();
    const morse = text.split('').map(char => {
        if (char === ' ') return '/';
        return reverseMorseMap[char] || '?';
    }).join(' ');
    morseOutput.value = morse;
});

// --- Logique du Quiz ---
function startQuiz(mode) {
    quizMode = mode;
    quizQueue = [...alphabet].sort(() => Math.random() - 0.5);
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-title').textContent = mode === 'toMorse' ? 'Traduire la lettre en Morse' : 'Traduire le Morse en lettre';
    showNextQuizItem();
}

function showNextQuizItem() {
    if (quizQueue.length === 0) {
        quizQueue = [...alphabet].sort(() => Math.random() - 0.5);
    }
    currentQuizItem = quizQueue.pop();
    const display = document.getElementById('quiz-question-display');
    
    if (quizMode === 'toMorse') {
        display.textContent = currentQuizItem;
    } else {
        display.textContent = reverseMorseMap[currentQuizItem];
    }
    
    document.getElementById('quiz-answer-input').value = '';
    document.getElementById('quiz-feedback').className = 'feedback';
    document.getElementById('quiz-feedback').textContent = '';
}

function checkQuizAnswer() {
    const input = document.getElementById('quiz-answer-input').value.trim().toUpperCase();
    const feedback = document.getElementById('quiz-feedback');
    let isCorrect = false;
    let correctAnswer = '';

    if (quizMode === 'toMorse') {
        correctAnswer = reverseMorseMap[currentQuizItem];
        isCorrect = (input === correctAnswer);
    } else {
        correctAnswer = currentQuizItem;
        isCorrect = (input === correctAnswer);
    }

    // Mise à jour stats
    if (!quizStats[currentQuizItem]) quizStats[currentQuizItem] = { correct: 0, total: 0 };
    quizStats[currentQuizItem].total++;
    if (isCorrect) {
        quizStats[currentQuizItem].correct++;
        feedback.textContent = "Correct !";
        feedback.className = "feedback correct";
    } else {
        feedback.textContent = `Incorrect. La réponse était : ${correctAnswer}`;
        feedback.className = "feedback incorrect";
    }

    saveStats();
    updateStatsDisplay();
    setTimeout(showNextQuizItem, 1500);
}

// --- Statistiques et Cookies ---
function saveStats() {
    const d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    document.cookie = `morse_quiz_stats=${JSON.stringify(quizStats)};expires=${d.toUTCString()};path=/`;
}

function loadStats() {
    const name = "morse_quiz_stats=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            try {
                quizStats = JSON.parse(c.substring(name.length, c.length));
            } catch(e) { quizStats = {}; }
        }
    }
}

function updateStatsDisplay() {
    const globalStatsDiv = document.getElementById('global-stats');
    const letterStatsDiv = document.getElementById('letter-stats-grid');
    
    let totalCorrect = 0;
    let totalAttempts = 0;
    let letterHtml = '';

    alphabet.forEach(letter => {
        const s = quizStats[letter] || { correct: 0, total: 0 };
        totalCorrect += s.correct;
        totalAttempts += s.total;
        const percent = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        
        letterHtml += `
            <div class="stat-card">
                <div class="stat-letter">${letter}</div>
                <div class="stat-score">${s.correct}/${s.total}</div>
                <div class="stat-percent">${percent}%</div>
            </div>
        `;
    });

    const globalPercent = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    globalStatsDiv.innerHTML = `
        <div class="global-stat-item">Tentatives : <strong>${totalAttempts}</strong></div>
        <div class="global-stat-item">Réussite : <strong>${totalCorrect}</strong></div>
        <div class="global-stat-item">Précision : <strong>${globalPercent}%</strong></div>
    `;
    letterStatsDiv.innerHTML = letterHtml;
}

// Événements Quiz
document.getElementById('btn-quiz-morse')?.addEventListener('click', () => startQuiz('toMorse'));
document.getElementById('btn-quiz-text')?.addEventListener('click', () => startQuiz('toText'));
document.getElementById('btn-submit-quiz')?.addEventListener('click', checkQuizAnswer);
document.getElementById('quiz-answer-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkQuizAnswer();
});
document.getElementById('btn-reset-stats')?.addEventListener('click', () => {
    if(confirm("Réinitialiser les statistiques ?")) {
        quizStats = {};
        saveStats();
        updateStatsDisplay();
    }
});
