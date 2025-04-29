async function hashString(str) {
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 8);
}

function generateTimeBasedSeed() {
    const now = new Date();
    now.setSeconds(0, 0);
    const utcString = now.toUTCString();
    return hashString(utcString);
}

document.addEventListener('DOMContentLoaded', async function() {
    const playerCountInput = document.getElementById('playerCount');
    const playerNumberInput = document.getElementById('playerNumber');
    const maxPlayerSpan = document.getElementById('maxPlayer');
    const seedInput = document.getElementById('seed');
    const refreshButton = document.getElementById('refreshSeed');
    const beginButton = document.getElementById('beginButton');
    
    playerCountInput.addEventListener('change', function() {
        const playerCount = parseInt(playerCountInput.value);
        maxPlayerSpan.textContent = playerCount;
        playerNumberInput.max = playerCount;
        
        if (parseInt(playerNumberInput.value) > playerCount) {
            playerNumberInput.value = 1;
        }
    });
    
    playerNumberInput.addEventListener('change', function() {
        const playerCount = parseInt(playerCountInput.value);
        const playerNumber = parseInt(playerNumberInput.value);
        
        if (playerNumber < 1) {
            playerNumberInput.value = 1;
        } else if (playerNumber > playerCount) {
            playerNumberInput.value = playerCount;
        }
    });
    
    seedInput.value = await generateTimeBasedSeed();
    
    refreshButton.addEventListener('click', async function() {
        seedInput.value = await generateTimeBasedSeed();
    });
    
    beginButton.addEventListener('click', async function() {
        const playerCount = parseInt(playerCountInput.value);
        const playerNumber = parseInt(playerNumberInput.value);
        const seed = seedInput.value;
        
        if (playerNumber < 1 || playerNumber > playerCount) {
            alert('Please enter a valid player number');
            return;
        }
        
        window.location.href = `game.html?player=${playerNumber}&total=${playerCount}&seed=${encodeURIComponent(seed)}`;
    });
}); 