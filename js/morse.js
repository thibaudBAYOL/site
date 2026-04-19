/*Use of Manus (https://manus.im/app) for first code generation*/
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

let pressStartTime;
let currentMorseWord = "";
let fullMorseMessage = "";
const LONG_PRESS_THRESHOLD = 250; // ms pour différencier court (.) de long (-)

const morseInputArea = document.getElementById('morse-input-area');
const textOutput = document.getElementById('text-output');
const textInput = document.getElementById('text-input');
const morseOutput = document.getElementById('morse-output');
const tapButton = document.getElementById('tap-button');
const tabMorse = document.getElementById('tabMorse');
// --- Logique de saisie par clic ---

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

function handleStart(e) {
    e.preventDefault();
    pressStartTime = Date.now();
    tapButton.classList.add('active');
}

function handleEnd(e) {
    e.preventDefault();
    if (!pressStartTime) return;
    
    const duration = Date.now() - pressStartTime;
    const symbol = duration > LONG_PRESS_THRESHOLD ? '-' : '.';
    
    currentMorseWord += symbol;
    updateMorseDisplay();
    translateMorseToText();
    
    pressStartTime = null;
    tapButton.classList.remove('active');
}

function updateMorseDisplay() {
    morseInputArea.value = fullMorseMessage + (fullMorseMessage ? " " : "") + currentMorseWord;
}

function translateMorseToText() {
    const parts = morseInputArea.value.trim().split(/\s+/);
    const translated = parts.map(part => morseMap[part] || '?').join('');
    textOutput.value = translated;
}

// Boutons de contrôle pour la saisie Morse
document.getElementById('btn-space-char').addEventListener('click', () => {
    if (currentMorseWord) {
        fullMorseMessage += (fullMorseMessage ? " " : "") + currentMorseWord;
        currentMorseWord = "";
        updateMorseDisplay();
    }
});

document.getElementById('btn-space-word').addEventListener('click', () => {
    if (currentMorseWord) {
        fullMorseMessage += (fullMorseMessage ? " " : "") + currentMorseWord + " /";
    } else {
        fullMorseMessage += " /";
    }
    currentMorseWord = "";
    updateMorseDisplay();
    translateMorseToText();
});

document.getElementById('btn-clear-morse').addEventListener('click', () => {
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
