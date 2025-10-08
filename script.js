const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Sons
const eatSound = new Audio('comer.mp3');  // Som ao comer a comida
const gameOverSound = new Audio('gameover.mp3');  // Som ao finalizar o jogo

// Configurações do Jogo
const gridSize = 20; 
const canvasSize = 400; 
const initialSnakeLength = 5; 
let snake = [];
let direction = 'right';
let food = { x: 0, y: 0 };
let score = 0; 
let gameSpeed = 100; 
let gameInterval;
let difficultyInterval;

// Função para iniciar o jogo
function initGame() {
    snake = [];
    direction = 'right';
    score = 0;
    for (let i = initialSnakeLength - 1; i >= 0; i--) {
        snake.push({ x: i, y: 0 });
    }
    generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
    document.getElementById('startScreen').style.display = 'none'; 
    document.getElementById('gameArea').style.display = 'block'; 
    document.getElementById('gameOverScreen').style.display = 'none';
    updateScore();
}

// Função para desenhar o quadro
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a cobrinha
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00FF00' : '#FFFFFF'; // Cabeça verde e o resto branco
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Desenha a comida
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Desenha a pontuação
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.fillText('Pontuação: ' + score, 10, 30); // Exibe a pontuação
}

// Função para aumentar a dificuldade
function increaseDifficulty() {
    if (score % 50 === 0 && score > 0) {  // Aumenta a dificuldade a cada 50 pontos
        gameSpeed -= 10; // Diminui o intervalo para aumentar a velocidade
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
}

// Função para atualizar a posição da cobrinha
function gameLoop() {
    const head = { ...snake[0] };

    if (direction === 'right') head.x += 1;
    if (direction === 'left') head.x -= 1;
    if (direction === 'up') head.y -= 1;
    if (direction === 'down') head.y += 1;

    // Checa se a cobrinha bateu nas bordas ou nela mesma
    if (head.x < 0 || head.x >= canvasSize / gridSize || head.y < 0 || head.y >= canvasSize / gridSize || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Adiciona a nova cabeça
    snake.unshift(head);

    // Checa se a cobrinha comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        eatSound.play(); // Som de comer comida
        generateFood();
        increaseDifficulty();
    } else {
        snake.pop(); // Remove a cauda
    }

    draw();
}

// Função para gerar nova comida
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)),
        y: Math.floor(Math.random() * (canvasSize / gridSize))
    };
}

// Função para controlar a direção da cobrinha
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } else if (event.key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    } else if (event.key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } else if (event.key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    } else if (event.key === 'a') { // Diminuir a velocidade
        gameSpeed = Math.min(200, gameSpeed + 10);
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    } else if (event.key === 'd') { // Aumentar a velocidade
        gameSpeed = Math.max(50, gameSpeed - 10);
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
});

// Atualiza o score na tela
function updateScore() {
    document.querySelector('.score').textContent = `Pontuação: ${score}`;
}

// Função para o fim de jogo
function gameOver() {
    gameOverSound.play(); // Som de Game Over
    clearInterval(gameInterval);
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'block';
    document.getElementById('finalScore').innerText = score;
}

// Reinicia o jogo ao clicar no botão
document.getElementById('restartBtn').addEventListener('click', () => {
    initGame();
});

// Inicia o jogo ao clicar no botão
document.getElementById('startBtn').addEventListener('click', initGame);
