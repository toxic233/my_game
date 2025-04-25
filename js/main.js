// 主页面交互逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 游戏卡片点击事件
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const gameId = e.currentTarget.id;
            
            switch(gameId) {
                case 'tictactoe':
                    window.location.href = './tictactoe.html';
                    break;
                case 'snake':
                    window.location.href = './snake.html';
                    break;
                case 'tetris':
                    window.location.href = './tetris.html';
                    break;
                case 'pacman':
                    alert('吃豆人游戏即将开发');
                    break;
                default:
                    console.log('未知游戏');
            }
        });
    });
});