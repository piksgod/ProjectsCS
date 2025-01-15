class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.isAIMode = false;
        
        // Elementos do DOM
        this.cells = document.querySelectorAll('.cell');
        this.statusElement = document.getElementById('status');
        this.restartButton = document.getElementById('restart');
        this.resetScoreButton = document.getElementById('resetScore');
        this.toggleModeButton = document.getElementById('toggleMode');
        this.playerOLabel = document.getElementById('playerOLabel');
        
        // Placar
        this.scores = {
            X: 0,
            O: 0,
            draw: 0
        };
        
        this.initializeGame();
        this.updateScoreDisplay();
    }

    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.resetScoreButton.addEventListener('click', () => this.resetScore());
        this.toggleModeButton.addEventListener('click', () => this.toggleGameMode());
    }

    toggleGameMode() {
        this.isAIMode = !this.isAIMode;
        this.toggleModeButton.textContent = `Modo: ${this.isAIMode ? 'vs IA' : '2 Jogadores'}`;
        this.playerOLabel.textContent = this.isAIMode ? 'Computador (O)' : 'Jogador O';
        this.restartGame();
    }

    handleCellClick(cell) {
        const index = cell.getAttribute('data-index');
        
        if (this.board[index] === '' && this.gameActive) {
            // Jogada do jogador
            this.makeMove(index);

            // Se estiver no modo IA e o jogo ainda estiver ativo, fazer a jogada da IA
            if (this.isAIMode && this.gameActive) {
                setTimeout(() => {
                    const aiMove = this.getAIMove();
                    if (aiMove !== null) {
                        this.makeMove(aiMove);
                        this.cells[aiMove].classList.add('ai-move');
                        setTimeout(() => {
                            this.cells[aiMove].classList.remove('ai-move');
                        }, 300);
                    }
                }, 500);
            }
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        this.cells[index].style.color = this.currentPlayer === 'X' ? '#e74c3c' : '#3498db';
        
        if (this.checkWin()) {
            this.statusElement.textContent = `${this.isAIMode && this.currentPlayer === 'O' ? 'Computador' : 'Jogador ' + this.currentPlayer} venceu!`;
            this.gameActive = false;
            this.updateScore(this.currentPlayer);
        } else if (this.checkDraw()) {
            this.statusElement.textContent = 'Empate!';
            this.gameActive = false;
            this.updateScore('draw');
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            if (!this.isAIMode || this.currentPlayer === 'X') {
                this.statusElement.textContent = `Vez do jogador: ${this.currentPlayer}`;
            } else {
                this.statusElement.textContent = 'Vez do computador...';
            }
        }
    }

    getAIMove() {
        // 1. Verificar se a IA pode vencer
        const winningMove = this.findWinningMove('O');
        if (winningMove !== null) return winningMove;

        // 2. Bloquear jogada de vitória do jogador
        const blockingMove = this.findWinningMove('X');
        if (blockingMove !== null) return blockingMove;

        // 3. Tentar pegar o centro
        if (this.board[4] === '') return 4;

        // 4. Tentar pegar os cantos
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => this.board[corner] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // 5. Pegar qualquer posição disponível
        const availableMoves = this.board.map((cell, index) => cell === '' ? index : null).filter(cell => cell !== null);
        if (availableMoves.length > 0) {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }

        return null;
    }

    findWinningMove(player) {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
            [0, 4, 8], [2, 4, 6] // Diagonais
        ];

        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (this.board[a] === player && this.board[b] === player && this.board[c] === '') return c;
            if (this.board[a] === player && this.board[c] === player && this.board[b] === '') return b;
            if (this.board[b] === player && this.board[c] === player && this.board[a] === '') return a;
        }

        return null;
    }

    checkWin() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
            [0, 4, 8], [2, 4, 6] // Diagonais
        ];

        return winConditions.some(condition => {
            return condition.every(index => {
                return this.board[index] === this.currentPlayer;
            });
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    updateScore(winner) {
        if (winner === 'draw') {
            this.scores.draw++;
        } else {
            this.scores[winner]++;
        }
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        document.getElementById('scoreX').textContent = this.scores.X;
        document.getElementById('scoreO').textContent = this.scores.O;
        document.getElementById('scoreDraw').textContent = this.scores.draw;
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.statusElement.textContent = `Vez do jogador: ${this.currentPlayer}`;
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('ai-move');
        });
    }

    resetScore() {
        this.scores = {
            X: 0,
            O: 0,
            draw: 0
        };
        this.updateScoreDisplay();
        this.restartGame();
    }
}

// Iniciar o jogo
new TicTacToe();