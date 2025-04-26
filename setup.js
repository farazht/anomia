document.addEventListener('DOMContentLoaded', function() {
    const playerCountInput = document.getElementById('playerCount');
    const playerNumberInput = document.getElementById('playerNumber');
    const maxPlayerSpan = document.getElementById('maxPlayer');
    const seedInput = document.getElementById('seed');
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
    
    beginButton.addEventListener('click', function() {
        const playerCount = parseInt(playerCountInput.value);
        const playerNumber = parseInt(playerNumberInput.value);
        const seed = seedInput.value.trim();
        
        window.location.href = `game.html?player=${playerNumber}&total=${playerCount}&seed=${encodeURIComponent(seed)}`;
    });
}); 