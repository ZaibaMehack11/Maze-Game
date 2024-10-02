let player = document.getElementById('player');
let finish = document.getElementById('finish');
let status = document.getElementById('status');
let maze = document.getElementById('maze');
let mazeWidth = maze.offsetWidth;
let mazeHeight = maze.offsetHeight;
let walls = [];
let gameOver = false;

// Random color generator
function randomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Create random walls
function createRandomWalls(numWalls) {
    for (let i = 0; i < numWalls; i++) {
        let wall = document.createElement('div');
        wall.className = 'wall';
        wall.style.width = `${Math.floor(Math.random() * 100) + 50}px`;
        wall.style.height = `${Math.floor(Math.random() * 20) + 10}px`;
        wall.style.top = `${Math.floor(Math.random() * (mazeHeight - 30))}px`;
        wall.style.left = `${Math.floor(Math.random() * (mazeWidth - 30))}px`;
        wall.style.backgroundColor = randomColor(); // Random wall color
        maze.appendChild(wall);
        walls.push(wall);
    }
}

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

    // Check collision with walls
    walls.forEach(wall => {
        if (isCollision(player, wall)) {
            status.textContent = "You hit a wall! Game over!";
            status.style.color = "#e74c3c";
            gameOver = true;
        }
    });

    // Check if reached finish point
    if (isCollision(player, finish)) {
        status.textContent = "Congratulations! You reached the finish!";
        status.style.color = "#2ecc71";
        gameOver = true;
    }
}

// Function to check collision
function isCollision(player, obstacle) {
    let playerRect = player.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    return !(
        playerRect.bottom < obstacleRect.top ||
        playerRect.top > obstacleRect.bottom ||
        playerRect.right < obstacleRect.left ||
        playerRect.left > obstacleRect.right
    );
}

// Initialize the game
function initializeGame() {
    // Randomize finish position
    finish.style.top = `${Math.floor(Math.random() * (mazeHeight - finish.offsetHeight))}px`;
    finish.style.left = `${Math.floor(Math.random() * (mazeWidth - finish.offsetWidth))}px`;

    // Create random walls
    createRandomWalls(10);
}

initializeGame();
