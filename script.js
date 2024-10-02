let player = document.getElementById('player');
let finish = document.getElementById('finish');
let status = document.getElementById('status');
let maze = document.getElementById('maze');
let nameInputModal = document.getElementById('nameInputModal');
let playerNameDisplay = document.getElementById('playerName');
let playerNameInput = document.getElementById('playerNameInput');
let startGameBtn = document.getElementById('startGameBtn');
let toggleButton = document.getElementById('toggleMode');
let timerDisplay = document.getElementById('timer');
let playCountDisplay = document.getElementById('playCount');
let mazeWidth = maze.offsetWidth;
let mazeHeight = maze.offsetHeight;
let walls = [];
let gameOver = false;
let gameTimer;
let seconds = 0;
let playCount = 0;

// Random color generator
function randomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Set player (start ball) and finish ball positions
function setStartAndFinishPositions() {
    player.style.top = '0px'; // Top-left corner for start
    player.style.left = '0px';
    finish.style.top = `${mazeHeight - finish.offsetHeight}px`; // Bottom-right corner for finish
    finish.style.left = `${mazeWidth - finish.offsetWidth}px`;
}

// Create random walls, ensuring they stay within the maze bounds
function createRandomWalls(numWalls) {
    walls.forEach(wall => wall.remove()); // Remove any existing walls
    walls = []; // Clear the walls array

    for (let i = 0; i < numWalls; i++) {
        let wall = document.createElement('div');
        wall.className = 'wall';
        wall.style.width = `${Math.floor(Math.random() * 80) + 50}px`; // Constrain wall width
        wall.style.height = `${Math.floor(Math.random() * 20) + 10}px`; // Constrain wall height
        
        // Ensure the walls are within the maze boundaries
        wall.style.top = `${Math.floor(Math.random() * (mazeHeight - 50))}px`; 
        wall.style.left = `${Math.floor(Math.random() * (mazeWidth - 50))}px`;
        wall.style.backgroundColor = randomColor(); // Random wall color
        
        maze.appendChild(wall);
        walls.push(wall);
    }
}

// Light/Dark mode toggle
toggleButton.addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
    
    if (document.body.classList.contains('light-mode')) {
        toggleButton.textContent = 'Switch to Dark Mode';
    } else {
        toggleButton.textContent = 'Switch to Light Mode';
    }
});

// Player movement
window.addEventListener('keydown', movePlayer);

function movePlayer(event) {
    if (gameOver) return;

    let top = parseInt(window.getComputedStyle(player).getPropertyValue("top"));
    let left = parseInt(window.getComputedStyle(player).getPropertyValue("left"));

    // Arrow keys to move
    if (event.key === "ArrowUp") top -= 10;
    if (event.key === "ArrowDown") top += 10;
    if (event.key === "ArrowLeft") left -= 10;
    if (event.key === "ArrowRight") left += 10;

    // Boundary check
    if (top < 0) top = 0;
    if (top > mazeHeight - player.offsetHeight) top = mazeHeight - player.offsetHeight;
    if (left < 0) left = 0;
    if (left > mazeWidth - player.offsetWidth) left = mazeWidth - player.offsetWidth;

    // Update player position
    player.style.top = top + 'px';
    player.style.left = left + 'px';

    // Check for wall collision
    checkWallCollision();

    // Check if player reaches the finish point
    checkWinCondition();
}

// Check if player hits a wall
function checkWallCollision() {
    let playerRect = player.getBoundingClientRect();

    for (let wall of walls) {
        let wallRect = wall.getBoundingClientRect();

        if (playerRect.left < wallRect.right &&
            playerRect.right > wallRect.left &&
            playerRect.top < wallRect.bottom &&
            playerRect.bottom > wallRect.top) {
            // End the game if player hits a wall
            gameOver = true;
            status.textContent = "Game Over! You hit a wall!";
            clearInterval(gameTimer);
            break;
        }
    }
}

// Check if player reaches the finish point
function checkWinCondition() {
    let playerRect = player.getBoundingClientRect();
    let finishRect = finish.getBoundingClientRect();

    if (playerRect.top < finishRect.bottom && playerRect.bottom > finishRect.top &&
        playerRect.left < finishRect.right && playerRect.right > finishRect.left) {
        gameOver = true;
        status.textContent = "Congratulations! You won!";
        clearInterval(gameTimer);
    }
}

// Timer function
function startTimer() {
    seconds = 0;
    timerDisplay.textContent = `${seconds}s`;
    gameTimer = setInterval(function() {
        seconds++;
        timerDisplay.textContent = `${seconds}s`;
    }, 1000);
}

// Start Game Button Click Event
startGameBtn.addEventListener('click', function() {
    let playerName = playerNameInput.value;
    if (playerName.trim() === "") {
        alert("Please enter a name to start the game.");
        return;
    }

    playerNameDisplay.textContent = playerName;
    nameInputModal.style.display = 'none'; // Hide the name input modal
    setStartAndFinishPositions();
    createRandomWalls(15); // Increase the number of walls
    startTimer();
    gameOver = false; // Reset game over state
});

// Open modal when the game loads
window.onload = function() {
    nameInputModal.style.display = 'flex';
};
