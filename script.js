const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Sons
const eatSound = new Audio('comer.mp3');
const gameOverSound = new Audio('gameover.mp3');

// Configurações
const gridSize = 20;
const canvasSize = 400;
const initialSnakeLength = 5;
let snake = [];
let direction = 'right';
let food = { x: 0, y: 0 };
let score = 0;
let gameSpeed = 100;
let gameInterval;

// Inicia o jogo
function initGame() {
    snake = [];
    direction = 'right';
    score = 0;
    gameSpeed = 100;

    for (let i = initialSnakeLength - 1; i >= 0; i--) {
        snake.push({ x: i, y: 0 });
    }

    generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);

    // Troca telas
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('gameOverScreen').style.display = 'none';

    updateScore();
}

// Atualiza pontuação
function updateScore() {
    document.querySelector('.score').textContent = `Pontuação: ${score}`;
}

// Gera comida aleatória
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)),
        y: Math.floor(Math.random() * (canvasSize / gridSize))
    };
}

// Desenha tudo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cobra
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00FF00' : '#FFFFFF';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Comida
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Loop principal do jogo
function gameLoop() {
    const head = { ...snake[0] };

    if (direction === 'right') head.x += 1;
    if (direction === 'left') head.x -= 1;
    if (direction === 'up') head.y -= 1;
    if (direction === 'down') head.y += 1;

    const hitWall = head.x < 0 || head.x >= canvasSize / gridSize || head.y < 0 || head.y >= canvasSize / gridSize;
    const hitSelf = snake.some(segment => segment.x === head.x && segment.y === head.y);

    if (hitWall || hitSelf) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        eatSound.play();
        updateScore();
        generateFood();
        increaseDifficulty();
    } else {
        snake.pop();
    }

    draw();
}

// Dificuldade progressiva
function increaseDifficulty() {
    if (score % 50 === 0 && score > 0) {
        gameSpeed = Math.max(50, gameSpeed - 10);
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
}

// Direções do teclado
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    else if (event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    else if (event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    else if (event.key === 'ArrowRight' && direction !== 'left') direction = 'right';

    // Ajuste de velocidade manual
    else if (event.key === 'a') {
        gameSpeed = Math.min(200, gameSpeed + 10);
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    } else if (event.key === 'd') {
        gameSpeed = Math.max(50, gameSpeed - 10);
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
});

// Função de Game Over
function gameOver() {
    gameOverSound.play();
    clearInterval(gameInterval);

    addToRanking(score);
    displayRanking();

    // Troca de telas
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('startScreen').style.display = 'block';
}

// Adiciona pontuação ao ranking local
function addToRanking(newScore) {
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push(newScore);
    ranking.sort((a, b) => b - a);
    ranking = ranking.slice(0, 5); // top 5
    localStorage.setItem('ranking', JSON.stringify(ranking));
}

// Exibe ranking na tela de início
function displayRanking() {
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = ''; // Limpa

    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}º - ${score} pontos`;
        rankingList.appendChild(li);
    });
}

// Botões
document.getElementById('startBtn').addEventListener('click', initGame);
document.getElementById('restartBtn').addEventListener('click', initGame);

// Mostra ranking ao abrir a página
window.addEventListener('load', displayRanking);

