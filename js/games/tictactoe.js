document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const cells = [];
    let currentPlayer = 'x';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // 行
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // 列
        [0, 4, 8], [2, 4, 6]             // 对角线
    ];
    let gameActive = true;
    let playerScore = 0;
    let aiScore = 0;

    // 初始化游戏板
    function initializeBoard() {
        board.innerHTML = '';
        cells.length = 0;
        gameState = ['', '', '', '', '', '', '', '', ''];
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('tictactoe-cell');
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
            cells.push(cell);
        }
        
        gameActive = true;
        document.getElementById('restart-btn').addEventListener('click', resetGame);
        updateScores();
    }

    // 处理玩家点击
    function handleCellClick(e) {
        const index = e.target.getAttribute('data-index');
        
        if (gameState[index] !== '' || !gameActive) return;
        
        // 玩家下棋
        makeMove(e.target, index, currentPlayer);
        
        // 检查游戏状态
        if (checkWin()) {
            endGame(`${currentPlayer === 'x' ? '玩家' : 'AI'} 获胜!`);
            if (currentPlayer === 'x') playerScore++;
            else aiScore++;
            updateScores();
            return;
        }
        
        if (checkDraw()) {
            endGame('平局!');
            return;
        }
        
        // AI下棋
        currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
        if (gameActive) setTimeout(makeAiMove, 500);
    }

    // AI移动
    function makeAiMove() {
        // 简单AI逻辑：随机选择一个空位
        const emptyCells = gameState
            .map((val, idx) => val === '' ? idx : null)
            .filter(val => val !== null);
        
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const cellIndex = emptyCells[randomIndex];
            makeMove(cells[cellIndex], cellIndex, currentPlayer);
            
            if (checkWin()) {
                endGame(`${currentPlayer === 'x' ? '玩家' : 'AI'} 获胜!`);
                if (currentPlayer === 'x') playerScore++;
                else aiScore++;
                updateScores();
                return;
            }
            
            if (checkDraw()) {
                endGame('平局!');
                return;
            }
            
            currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
        }
    }

    // 执行移动
    function makeMove(cell, index, player) {
        gameState[index] = player;
        cell.classList.add(player);
        cell.textContent = player.toUpperCase();
    }

    // 检查胜利
    function checkWin() {
        return winningCombos.some(combo => {
            return combo.every(index => {
                return gameState[index] === currentPlayer;
            });
        });
    }

    // 检查平局
    function checkDraw() {
        return gameState.every(cell => cell !== '');
    }

    // 结束游戏
    function endGame(message) {
        gameActive = false;
        alert(message);
    }

    // 重置游戏
    function resetGame() {
        currentPlayer = 'x';
        initializeBoard();
    }

    // 更新分数显示
    function updateScores() {
        document.getElementById('player-score').textContent = playerScore;
        document.getElementById('ai-score').textContent = aiScore;
    }

    // 初始化游戏
    initializeBoard();
});