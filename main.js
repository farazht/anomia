const iconContainer = document.getElementById('iconContainer');
const topPrompt = document.getElementById('topPrompt');
const bottomPrompt = document.getElementById('bottomPrompt');
const scoreCounter = document.getElementById('scoreCounter');
const wonShowoffButton = document.getElementById('wonShowoff');
const prevButton = document.getElementById('prevButton');
const decreaseScoreButton = document.getElementById('decreaseScore');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const card = document.querySelector('.card');

let prompts = [];
const icons = [
    { file: '1.svg', color: '#e66aa1' },
    { file: '2.svg', color: '#a0d045' },
    { file: '3.svg', color: '#c970e0' },
    { file: '4.svg', color: '#6cd08e' },
    { file: '5.svg', color: '#e76d54' },
    { file: '6.svg', color: '#8093e5' },
    { file: '7.svg', color: '#cea94a' },
];

let prevStates = [];
let currentState = null;
let score = 0;
let allPrompts = [];

async function fetchPrompts() {
    const response = await fetch('prompts.json');
    allPrompts = await response.json();
    
    const params = new URLSearchParams(window.location.search);
    const playerNumber = parseInt(params.get('player'));
    const totalPlayers = parseInt(params.get('total'));
    const seed = params.get('seed') || 'anomia2023';
    
    const promptIndices = assignPrompts(allPrompts.length, totalPlayers, playerNumber, seed);
    
    prompts = promptIndices.map(index => allPrompts[index]);
    
    console.log(`Player ${playerNumber} has ${prompts.length} unique prompts using seed "${seed}"`);
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function loadSVG(file) {
    try {
        const res = await fetch(`assets/${file}`);
        if (!res.ok) throw new Error('SVG Load Failed');
        return await res.text();
    } catch (e) {
        console.error(e);
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="red"/></svg>';
    }
}

async function updateDisplay(state) {
    const svg = await loadSVG(state.icon.file);
    topPrompt.textContent = bottomPrompt.textContent = state.prompt;
    iconContainer.innerHTML = svg;
    document.querySelector('.card').style.backgroundColor = state.icon.color;
}

async function updateGame() {
    if (prompts.length === 0) {
        document.querySelector('.card').style.backgroundColor = '#f5f5f5';
        topPrompt.textContent = bottomPrompt.textContent = "OUT OF CARDS";
        iconContainer.innerHTML = '';
        return;
    }

    const promptIndex = Math.floor(Math.random() * prompts.length);
    const prompt = prompts.splice(promptIndex, 1)[0];
    const icon = getRandom(icons);

    currentState = { prompt, icon };
    prevStates.push(currentState);

    await updateDisplay(currentState);
}

async function goToPreviousCard() {
    if (prevStates.length > 0) {
        prevStates.pop();

        if (prevStates.length > 0) {
            currentState = prevStates[prevStates.length - 1];
            await updateDisplay(currentState);
        } else {
            currentState = null;
            topPrompt.textContent = '';
            bottomPrompt.textContent = '';
            iconContainer.innerHTML = '';
            document.querySelector('.card').style.backgroundColor = '#f5f5f5';
        }
    }
}

function updateScore(change) {
    score = Math.max(0, score + change);
    updateScoreDisplay();
}

function updateScoreDisplay() {
    scoreCounter.textContent = score + (score === 1 ? " POINT" : " POINTS");
}

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const playerNumber = parseInt(params.get('player'));
    const totalPlayers = parseInt(params.get('total'));
    
    if (!playerNumber || !totalPlayers || playerNumber < 1 || playerNumber > totalPlayers) {
        window.location.href = 'index.html';
        return false;
    }
    
    console.log(`Player ${playerNumber} of ${totalPlayers} players`);
    return true;
}

async function showStartMessage() {
    topPrompt.textContent = bottomPrompt.textContent = "TAP TO DRAW";
    iconContainer.innerHTML = '';
    document.querySelector('.card').style.backgroundColor = '#f5f5f5';
}

async function init() {
    if (!getUrlParams()) return;
    
    await fetchPrompts();
    await showStartMessage();
    
    const startGame = async () => {
        await updateGame();
        card.removeEventListener('click', startGame);
        card.addEventListener('click', updateGame);
    };
    
    card.addEventListener('click', startGame);
}

wonShowoffButton.addEventListener('click', () => {
    score++;
    updateScoreDisplay();
});

decreaseScoreButton.addEventListener('click', () => {
    score = Math.max(0, score - 1);
    updateScoreDisplay();
});

prevButton.addEventListener('click', goToPreviousCard);

if (fontSizeSlider) {
    fontSizeSlider.addEventListener('input', () => {
        const size = fontSizeSlider.value;
        if (topPrompt) topPrompt.style.fontSize = size + 'em';
        if (bottomPrompt) bottomPrompt.style.fontSize = size + 'em';
    });

    topPrompt.style.fontSize = '2.5em';
    bottomPrompt.style.fontSize = '2.5em';
}

init();
