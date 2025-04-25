document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const startButton = document.getElementById('start-btn');
    const directionButtons = {
        up: document.getElementById('up-btn'),
        left: document.getElementById('left-btn'),
        right: document.getElementById('right-btn'),
        down: document.getElementById('down-btn')
    };

    // 游戏常量
    const GRID_SIZE = 20;
    const TILE_COUNT = canvas.width / GRID_SIZE;
    const COLORS = {
        snake: '#4CAF50',
        head: '#2E7D32',
        food: '#f44336',
        background: '#f5f5f5'
    };

    // 游戏状态
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let gameSpeed = 200;  // 从150ms调整到200ms
    let gameLoop;

    // 初始化游戏
    function initGame() {
        // 初始化蛇身
        snake = [
            {x: 3, y: 0},
            {x: 2, y: 0},
            {x: 1, y: 0}
        ];
        
        generateFood();
        score = 0;
        updateScore();
        
        // 设置初始方向
        direction = 'right';
        nextDirection = 'right';
    }

    // 生成食物
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
        
        // 确保食物不会生成在蛇身上
        snake.forEach(segment => {
            if (segment.x === food.x && segment.y === food.y) {
                generateFood();
            }
        });
    }

    // 游戏主循环
    function gameUpdate() {
        moveSnake();
        checkCollision();
        drawGame();
    }

    // 移动蛇
    function moveSnake() {
        direction = nextDirection;
        const head = {x: snake[0].x, y: snake[0].y};
        
        switch(direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // 添加新头部
        snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            score++;
            updateScore();
            
            // 每5分加速一次
            if (score % 5 === 0) {
                gameSpeed = Math.max(100, gameSpeed - 10); // 最低速度从50ms调整为100ms
                clearInterval(gameLoop);
                gameLoop = setInterval(gameUpdate, gameSpeed);
            }
            
            generateFood();
        } else {
            // 没吃到食物则移除尾部
            snake.pop();
        }
    }

    // 检查碰撞
    function checkCollision() {
        const head = snake[0];
        
        // 撞墙检测
        if (
            head.x < 0 || head.x >= TILE_COUNT ||
            head.y < 0 || head.y >= TILE_COUNT
        ) {
            gameOver();
            return;
        }
        
        // 撞自身检测
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }
    }

    // 绘制游戏
    function drawGame() {
        // 清空画布
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制食物
        ctx.fillStyle = COLORS.food;
        ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        
        // 绘制蛇
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? COLORS.head : COLORS.snake;
            ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            
            // 添加蛇身细节
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        });
    }

    // 游戏结束
    function gameOver() {
        clearInterval(gameLoop);
        alert(`游戏结束! 你的得分: ${score}`);
    }

    // 更新分数
    function updateScore() {
        scoreElement.textContent = score;
    }

    // 键盘控制
    function handleKeyDown(e) {
        switch(e.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    }

    // 按钮控制
    function setupButtonControls() {
        directionButtons.up.addEventListener('click', () => {
            if (direction !== 'down') nextDirection = 'up';
        });
        directionButtons.down.addEventListener('click', () => {
            if (direction !== 'up') nextDirection = 'down';
        });
        directionButtons.left.addEventListener('click', () => {
            if (direction !== 'right') nextDirection = 'left';
        });
        directionButtons.right.addEventListener('click', () => {
            if (direction !== 'left') nextDirection = 'right';
        });
    }

    // 开始游戏
    function startGame() {
        clearInterval(gameLoop);
        initGame();
        gameLoop = setInterval(gameUpdate, gameSpeed);
    }

    // 初始化控制
    document.addEventListener('keydown', handleKeyDown);
    setupButtonControls();
    startButton.addEventListener('click', startGame);

    // 初始绘制
    initGame();
    drawGame();
});