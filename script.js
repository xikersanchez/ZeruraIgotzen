// Seleccionamos el canvas y el contexto
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dimensiones del canvas
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Variables del jugador
const player = {
    width: 30,
    height: 30,
    x: canvasWidth / 2 - 15, // Centrado horizontalmente
    y: canvasHeight - 60,
    color: 'red',
    speed: 5,
};

// Obstáculos
let obstacles = [];
const obstacleWidth = 80;
const obstacleHeight = 20;
let obstacleSpeed = 2;
let frame = 0;

// Estado del juego
let gameOver = false;

// Marcador de puntos
let score = 0;
let highScore = parseInt(localStorage.getItem('highScore')) || 0; // Cargar la mejor puntuación desde localStorage

// Colores de fondo
const initialBackgroundColor = { r: 176, g: 224, b: 230 }; // Azul cielo claro
const spaceBackgroundColor = { r: 0, g: 0, b: 0 }; // Negro para el espacio
const milkyWayColor = { r: 255, g: 255, b: 255 }; // Blanco para la Vía Láctea

// Control del jugador (movimiento lateral)
let keys = {
    right: false,
    left: false,
};

// Evento de teclas presionadas
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === 'ArrowLeft') keys.left = true;
});

// Evento de teclas soltadas
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'ArrowLeft') keys.left = false;
});

// Dibujar jugador
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Crear obstáculos
function createObstacle() {
    const x = Math.random() * (canvasWidth - obstacleWidth); // Posición aleatoria horizontal
    obstacles.push({ x, y: -obstacleHeight });
}

// Dibujar obstáculos
function drawObstacles() {
    ctx.fillStyle = 'green';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    });
}

// Mover obstáculos hacia abajo
function moveObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.y += obstacleSpeed;
    });
}

// Detectar colisiones
function checkCollision() {
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacleWidth &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacleHeight &&
            player.y + player.height > obstacle.y
        ) {
            gameOver = true; // Colisión detectada
            updateHighScore(); // Actualizar la mejor puntuación
        }
    });
}

// Incrementar la dificultad con el tiempo (velocidad de los obstáculos)
function increaseDifficulty() {
    // Incrementa la velocidad de los obstáculos cada 5 segundos (300 frames)
    if (frame % 300 === 0) {
        obstacleSpeed += 0.5;
    }
}

// Actualizar el color de fondo basado en el puntaje
function updateBackgroundColor() {
    const transitionThreshold1 = 2000;
    const transitionThreshold2 = 4000;
    
    if (score >= transitionThreshold2) {
        drawMilkyWayBackground(); // Mostrar la Vía Láctea
    } else if (score >= transitionThreshold1) {
        // Transición de color entre azul cielo claro y negro
        const ratio = Math.min((score - transitionThreshold1) / (transitionThreshold2 - transitionThreshold1), 1);
        const r = Math.round(initialBackgroundColor.r + (spaceBackgroundColor.r - initialBackgroundColor.r) * ratio);
        const g = Math.round(initialBackgroundColor.g + (spaceBackgroundColor.g - initialBackgroundColor.g) * ratio);
        const b = Math.round(initialBackgroundColor.b + (spaceBackgroundColor.b - initialBackgroundColor.b) * ratio);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    } else {
        ctx.fillStyle = `rgb(${initialBackgroundColor.r}, ${initialBackgroundColor.g}, ${initialBackgroundColor.b})`;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
}

// Dibujar nubes
function drawCloud(x, y, scale) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(x, y, 50 * scale, 30 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 40 * scale, y, 50 * scale, 30 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 40 * scale, y, 50 * scale, 30 * scale, 0, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

// Dibujar fondo con nubes
function drawBackground() {
    drawCloud(100, 100, 1);   // Nube 1
    drawCloud(300, 150, 0.7); // Nube 2
    drawCloud(200, 50, 0.5);  // Nube 3
}

// Dibujar la Vía Láctea
function drawMilkyWayBackground() {
    // Fondo negro
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Estrellas
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        const radius = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
    
    // Nube de estrellas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(canvasWidth / 2, canvasHeight / 2, 100, 30, 0, 0, Math.PI * 2);
    ctx.fill();
}

// Actualizar la mejor puntuación
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').innerText = `Mejor puntuación: ${highScore}`;
    }
}

// Actualizar puntos
function updateScore() {
    score++;
    document.getElementById('score').innerText = `Puntos: ${score}`;
}

// Actualizar el juego
function updateGame() {
    if (gameOver) {
        document.getElementById('gameOver').style.display = 'block';
        return;
    }

    updateBackgroundColor(); // Actualizar color de fondo

    // Dibujar fondo con nubes o Vía Láctea
    if (score < 4000) {
        drawBackground();
    }

    // Mover jugador
    if (keys.right) {
        player.x += player.speed;
        if (player.x > canvasWidth) {
            player.x = -player.width; // Teletransportar al jugador al borde izquierdo
        }
    }
    if (keys.left) {
        player.x -= player.speed;
        if (player.x + player.width < 0) {
            player.x = canvasWidth; // Teletransportar al jugador al borde derecho
        }
    }

    // Crear nuevos obstáculos cada 90 frames
    if (frame % 90 === 0) {
        createObstacle();
    }

    // Dibujar y mover obstáculos
    drawObstacles();
    moveObstacles();

    // Incrementar la dificultad
    increaseDifficulty();

    // Dibujar jugador
    drawPlayer();

    // Detectar colisiones
    checkCollision();

    // Eliminar obstáculos que salieron de la pantalla
    obstacles = obstacles.filter(obstacle => obstacle.y < canvasHeight);

    // Actualizar el marcador de puntos
    updateScore();

    frame++;
    requestAnimationFrame(updateGame);
}

// Inicializar el marcador de mejor puntuación
document.getElementById('highScore').innerText = `Mejor puntuación: ${highScore}`;

// Iniciar el juego
updateGame();
