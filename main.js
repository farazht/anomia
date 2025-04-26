const iconContainer = document.getElementById('iconContainer');
const topPrompt = document.getElementById('topPrompt');
const bottomPrompt = document.getElementById('bottomPrompt');
const scoreCounter = document.getElementById('scoreCounter');
const prevButton = document.getElementById('prevButton');
const decreaseButton = document.getElementById('decreaseButton');
const increaseButton = document.getElementById('increaseButton');

let prompts = [];
const icons = [
    { file: '1.svg', color: '#FF0000' },
    { file: '2.svg', color: '#0000FF' },
    { file: '3.svg', color: '#00FF00' },
    { file: '4.svg', color: '#FF00FF' },
    { file: '5.svg', color: '#8B008B' },
    { file: '6.svg', color: '#FFA500' },
    { file: '7.svg', color: '#00FFFF' },
];

let prevStates = [];
let currentState = null;
let score = 0;
let allPrompts = [];

async function fetchPrompts() {
    const response = await fetch('prompts.json');
    allPrompts = await response.json();
    
    // Get player parameters from URL
    const params = new URLSearchParams(window.location.search);
    const playerNumber = parseInt(params.get('player'));
    const totalPlayers = parseInt(params.get('total'));
    const seed = params.get('seed') || 'anomia2023';
    
    // Use the crypto.js function to assign prompts
    const promptIndices = assignPrompts(allPrompts.length, totalPlayers, playerNumber, seed);
    
    // Convert indices to actual prompts
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
        topPrompt.textContent = bottomPrompt.textContent = "Out of Cards";
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
    
    document.getElementById('playerNum').textContent = playerNumber;
    document.getElementById('totalPlayers').textContent = totalPlayers;
    console.log(`Player ${playerNumber} of ${totalPlayers} players`);
    return true;
}

async function init() {
    if (!getUrlParams()) return;
    
    await fetchPrompts();
    await updateGame();
}

iconContainer.addEventListener('click', updateGame);
prevButton.addEventListener('click', goToPreviousCard);
decreaseButton.addEventListener('click', () => updateScore(-1));
increaseButton.addEventListener('click', () => updateScore(1));

init();
