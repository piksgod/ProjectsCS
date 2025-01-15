class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Elementos do DOM
        this.cells = document.querySelectorAll('.cell');
        this.statusElement = document.getElementById('status');
        this.restartButton = document.getElementById('restart');
        this.resetScoreButton = document.getElementById('resetScore');
        
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
    }

    handleCellClick(cell) {
        const index = cell.getAttribute('data-index');
        
        if (this.board[index] === '' && this.gameActive) {
            this.board[index] = this.currentPlayer;
            cell.textContent = this.currentPlayer;
            cell.style.color = this.currentPlayer === 'X' ? '#e74c3c' : '#3498db';  // Adiciona o atributo para estilização
            
            if (this.checkWin()) {
                this.statusElement.textContent = `Jogador ${this.currentPlayer} venceu!`;
                this.gameActive = false;
                this.updateScore(this.currentPlayer);
            } else if (this.checkDraw()) {
                this.statusElement.textContent = 'Empate!';
                this.gameActive = false;
                this.updateScore('draw');
            } else {
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                this.statusElement.textContent = `Vez do jogador: ${this.currentPlayer}`;
            }
        }
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
        this.cells.forEach(cell => cell.textContent = '');
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