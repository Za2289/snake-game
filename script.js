// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-Text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Initially show instruction text and logo
instructionText.style.display = 'block';
logo.style.display = 'block';

// Draw game map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw snake
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the position of the snake or the food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Draw food function
function drawFood() {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
}

// Generate food function
function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

// Moving the snake
function move(){
    const head = {...snake[0]};
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
    checkCollision(); // Call collision detection after each move
}

// Start game function
function startGame() {
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame(); // Handles wall collisions
        return;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          resetGame();
        }
      }
    }

function resetGame() {
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
  }
function updateScore(){
    const currentscore = snake.length - 1;
    score.textContent = currentscore.toString().padStart(3,'0');
}

// Improved Keypress event listener to prevent reversing directly onto itself
function handleKeyPress(event) {
    if (!gameStarted && (event.code === 'Space' || event.key === ' ')) {
        startGame();
    } else if (gameStarted) {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
        }
    }
}
document.addEventListener('keydown', handleKeyPress);

module.exports = {
    snake,
    move,
    checkCollision,
    generateFood,
    resetGame,
    handleKeyPress
};
