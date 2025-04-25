document.addEventListener('DOMContentLoaded', () => {
    const BOARD_WIDTH = 10;
    const BOARD_HEIGHT = 20;
    const BLOCK_SIZE = 20;
    const EMPTY = 0;
    
    // 俄罗斯方块形状定义
    const SHAPES = [
        { color: '#FF0D72', cells: [[0,0], [1,0], [0,1], [1,1]] },  // 方块
        { color: '#0DC2FF', cells: [[0,0], [1,0], [2,0], [3,0]] },  // I
        { color: '#0DFF72', cells: [[0,0], [1,0], [1,1], [2,1]] },  // Z
        { color: '#F538FF', cells: [[1,0], [0,1], [1,1], [2,1]] },  // T
        { color: '#FF8E0D', cells: [[0,0], [1,0], [2,0], [2,1]] },  // L
        { color: '#FFE138', cells: [[0,1], [1,1], [2,1], [2,0]] },  // 反L
        { color: '#3877FF', cells: [[0,1], [1,1], [1,0], [2,0]] }   // 反Z
    ];

    // 游戏状态
    let board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(EMPTY));
    let currentPiece = null;
    let nextPiece = null;
    let currentX = 0;
    let currentY = 0;
    let score = 0;
    let level = 1;
    let gameInterval = null;
    let isGameOver = false;

    // DOM元素
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const nextPieceElement = document.getElementById('next-piece');
    const startButton = document.getElementById('start-btn');
    const rotateButton = document.getElementById('rotate-btn');
    const leftButton = document.getElementById('left-btn');
    const rightButton = document.getElementById('right-btn');
    const downButton = document.getElementById('down-btn');

    // 初始化游戏板
    function initBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.width = `${BOARD_WIDTH * BLOCK_SIZE}px`;
        gameBoard.style.height = `${BOARD_HEIGHT * BLOCK_SIZE}px`;
        
        board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(EMPTY));
        
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                const cell = document.createElement('div');
                cell.className = 'tetris-cell';
                cell.id = `cell-${y}-${x}`;
                cell.style.width = `${BLOCK_SIZE}px`;
                cell.style.height = `${BLOCK_SIZE}px`;
                gameBoard.appendChild(cell);
            }
        }
    }

    // 开始游戏
    function startGame() {
        clearInterval(gameInterval);
        score = 0;
        level = 1;
        isGameOver = false;
        updateScore();
        updateLevel();
        initBoard();
        spawnPiece();
        gameInterval = setInterval(gameLoop, 1000 - (level * 50));
    }

    // 游戏主循环
    function gameLoop() {
        if (!movePiece(0, 1)) {
            lockPiece();
            checkLines();
            spawnPiece();
        }
        updateBoard();
    }

    // 生成新方块
    function spawnPiece() {
        currentX = 3;
        currentY = 0;
        
        // 如果是第一个方块，创建下一个预览方块
        if (!nextPiece) {
            nextPiece = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        }
        
        currentPiece = nextPiece;
        nextPiece = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        
        // 显示下一个方块预览
        showNextPiece();
        
        // 检查游戏是否结束
        if (checkCollision(0, 0)) {
            clearInterval(gameInterval);
            isGameOver = true;
            alert(`游戏结束! 最终分数: ${score}`);
        }
    }

    // 显示下一个方块预览
    function showNextPiece() {
        if (!nextPiece || !nextPieceElement) return;
        
        nextPieceElement.innerHTML = '';
        nextPieceElement.style.width = `${4 * 20}px`;
        nextPieceElement.style.height = `${4 * 20}px`;
        nextPieceElement.style.display = 'grid';
        nextPieceElement.style.gridTemplateColumns = 'repeat(4, 1fr)';
        nextPieceElement.style.gap = '1px';
        
        // 创建一个4x4的网格来显示下一个方块
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const cell = document.createElement('div');
                cell.style.width = '20px';
                cell.style.height = '20px';
                cell.style.backgroundColor = '#f5f5f5';
                nextPieceElement.appendChild(cell);
            }
        }
        
        // 绘制下一个方块
        nextPiece.cells.forEach(cell => {
            const [x, y] = cell;
            const index = y * 4 + x;
            if (index >= 0 && index < nextPieceElement.children.length) {
                const cellElement = nextPieceElement.children[index];
                cellElement.style.backgroundColor = nextPiece.color;
            }
        });
    }

    // 移动方块
    function movePiece(x, y) {
        if (!isGameOver && !checkCollision(x, y)) {
            currentX += x;
            currentY += y;
            updateBoard();
            return true;
        }
        return false;
    }

    // 旋转方块
    function rotatePiece() {
        if (currentPiece === SHAPES[0]) return; // 方块不旋转
        
        const rotated = currentPiece.cells.map(([x, y]) => [-y, x]);
        
        if (!rotated.some(([x, y]) => {
            const newX = currentX + x;
            const newY = currentY + y;
            return (
                newX < 0 || newX >= BOARD_WIDTH ||
                newY >= BOARD_HEIGHT ||
                (newY >= 0 && board[newY][newX] !== EMPTY)
            );
        })) {
            currentPiece = {
                ...currentPiece,
                cells: rotated
            };
            updateBoard();
        }
    }

    // 锁定方块到游戏板上
    function lockPiece() {
        currentPiece.cells.forEach(([x, y]) => {
            const boardX = currentX + x;
            const boardY = currentY + y;
            if (boardY >= 0) {
                board[boardY][boardX] = currentPiece.color;
            }
        });
    }

    // 检查碰撞
    function checkCollision(x, y) {
        return currentPiece.cells.some(([cx, cy]) => {
            const newX = currentX + x + cx;
            const newY = currentY + y + cy;
            return (
                newX < 0 || newX >= BOARD_WIDTH ||
                newY >= BOARD_HEIGHT ||
                (newY >= 0 && board[newY][newX] !== EMPTY)
            );
        });
    }

    // 检查并清除完整行
    function checkLines() {
        let lines = 0;
        
        for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
            if (board[y].every(cell => cell !== EMPTY)) {
                // 上移所有行
                for (let ny = y; ny > 0; ny--) {
                    board[ny] = [...board[ny - 1]];
                }
                board[0] = Array(BOARD_WIDTH).fill(EMPTY);
                lines++;
                y++; // 再次检查当前行
            }
        }
        
        if (lines > 0) {
            // 更新分数 (简单计分规则)
            score += lines * lines * 100 * level;
            updateScore();
            
            // 每10行升一级
            if (score >= level * 2000) {
                level++;
                updateLevel();
                
                // 提高游戏速度
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, Math.max(100, 1000 - (level * 50)));
            }
        }
    }

    // 更新游戏板显示
    function updateBoard() {
        // 重置所有单元格
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                const cell = document.getElementById(`cell-${y}-${x}`);
                if (cell) {
                    cell.style.backgroundColor = board[y][x] || '#f5f5f5';
                }
            }
        }
        
        // 绘制当前方块
        if (currentPiece) {
            currentPiece.cells.forEach(([x, y]) => {
                const boardX = currentX + x;
                const boardY = currentY + y;
                if (boardY >= 0 && boardY < BOARD_HEIGHT && 
                    boardX >= 0 && boardX < BOARD_WIDTH) {
                    const cell = document.getElementById(`cell-${boardY}-${boardX}`);
                    if (cell) {
                        cell.style.backgroundColor = currentPiece.color;
                    }
                }
            });
        }
    }

    // 更新分数显示
    function updateScore() {
        if (scoreElement) {
            scoreElement.textContent = score;
        }
    }
    
    // 更新等级显示
    function updateLevel() {
        if (levelElement) {
            levelElement.textContent = level;
        }
    }

    // 初始化游戏
    initBoard();
    
    // 事件监听
    startButton.addEventListener('click', startGame);
    rotateButton.addEventListener('click', rotatePiece);
    leftButton.addEventListener('click', () => movePiece(-1, 0));
    rightButton.addEventListener('click', () => movePiece(1, 0));
    downButton.addEventListener('click', () => movePiece(0, 1));

    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (isGameOver) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                movePiece(-1, 0);
                break;
            case 'ArrowRight':
                movePiece(1, 0);
                break;
            case 'ArrowDown':
                movePiece(0, 1);
                break;
            case 'ArrowUp':
                rotatePiece();
                break;
            case ' ':
                // 快速下落
                while(movePiece(0, 1)) {}
                break;
        }
    });
});