document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');
    const scoreDisplay = document.getElementById('score');
    const newGameButton = document.getElementById('new-game');
    let grid = [];
    let score = 0;

    // 初始化游戏
    function initGame() {
        grid = Array(4).fill().map(() => Array(4).fill(0));
        score = 0;
        scoreDisplay.textContent = score;
        addNewTile();
        addNewTile();
        updateGrid();
    }

    // 添加新的数字块
    function addNewTile() {
        const emptyTiles = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 0) {
                    emptyTiles.push({i, j});
                }
            }
        }
        if (emptyTiles.length > 0) {
            const {i, j} = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            grid[i][j] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // 更新网格显示
    function updateGrid() {
        gridContainer.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                if (grid[i][j] !== 0) {
                    cell.textContent = grid[i][j];
                    cell.classList.add(`cell-${grid[i][j]}`);
                }
                gridContainer.appendChild(cell);
            }
        }
    }

    // 移动和合并数字块
    function move(direction) {
        let moved = false;
        const rotatedGrid = rotateGrid(grid, direction);

        for (let i = 0; i < 4; i++) {
            const row = rotatedGrid[i].filter(val => val !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    row[j + 1] = 0;
                    score += row[j];
                    moved = true;
                }
            }
            const newRow = row.filter(val => val !== 0);
            while (newRow.length < 4) {
                newRow.push(0);
            }
            if (newRow.join(',') !== rotatedGrid[i].join(',')) {
                moved = true;
            }
            rotatedGrid[i] = newRow;
        }

        grid = rotateGrid(rotatedGrid, 4 - direction);
        return moved;
    }

    // 旋转网格
    function rotateGrid(grid, times) {
        const rotatedGrid = JSON.parse(JSON.stringify(grid));
        for (let i = 0; i < times; i++) {
            const newGrid = [];
            for (let j = 0; j < 4; j++) {
                newGrid.push([]);
                for (let k = 3; k >= 0; k--) {
                    newGrid[j].push(rotatedGrid[k][j]);
                }
            }
            rotatedGrid.splice(0, 4, ...newGrid);
        }
        return rotatedGrid;
    }

    // 检查游戏是否结束
    function isGameOver() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 0) return false;
                if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
                if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
            }
        }
        return true;
    }

    // 处理按键事件
    document.addEventListener('keydown', (e) => {
        let direction;
        switch (e.key) {
            case 'ArrowUp': direction = 3; break;
            case 'ArrowRight': direction = 2; break;
            case 'ArrowDown': direction = 1; break;
            case 'ArrowLeft': direction = 0; break;
            default: return;
        }
        if (move(direction)) {
            addNewTile();
            updateGrid();
            scoreDisplay.textContent = score;
            if (isGameOver()) {
                alert('游戏结束！您的得分是：' + score);
            }
        }
    });

    // 新游戏按钮事件
    newGameButton.addEventListener('click', initGame);

    // 初始化游戏
    initGame();
});

