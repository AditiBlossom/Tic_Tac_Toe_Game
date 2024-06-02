// script.js
document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const statusText = document.getElementById("status");
    const resetButton = document.getElementById("reset");
    let board = ["", "", "", "", "", "", "", "", ""];
    let isGameActive = true;
    let currentPlayer = "X";

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleCellClick = (e) => {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== "" || !isGameActive) {
            return;
        }

        board[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        checkForWinner();

        if (isGameActive) {
            currentPlayer = "O";
            aiMove();
        }
    };

    const checkForWinner = () => {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === "" || b === "" || c === "") {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusText.textContent = `Player ${currentPlayer} has won!`;
            isGameActive = false;
            return;
        }

        if (!board.includes("")) {
            statusText.textContent = "Game is a draw!";
            isGameActive = false;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `It's ${currentPlayer}'s turn`;
    };

    const aiMove = () => {
        if (!isGameActive) return;
        
        let availableCells = [];
        board.forEach((cell, index) => {
            if (cell === "") availableCells.push(index);
        });

        if (availableCells.length === 0) return;

        // AI logic: Choose the best move
        let bestMove = null;
        let bestScore = -Infinity;

        for (let i of availableCells) {
            board[i] = currentPlayer;
            let score = minimax(board, 0, false);
            board[i] = "";

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }

        board[bestMove] = currentPlayer;
        cells[bestMove].textContent = currentPlayer;
        checkForWinner();
        currentPlayer = "X";
    };

    const minimax = (newBoard, depth, isMaximizing) => {
        let scores = {
            X: -10,
            O: 10,
            tie: 0
        };

        let result = checkWinner();
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (newBoard[i] === "") {
                    newBoard[i] = "O";
                    let score = minimax(newBoard, depth + 1, false);
                    newBoard[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (newBoard[i] === "") {
                    newBoard[i] = "X";
                    let score = minimax(newBoard, depth + 1, true);
                    newBoard[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const checkWinner = () => {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        if (!board.includes("")) {
            return "tie";
        }

        return null;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
        isGameActive = true;
        currentPlayer = "X";
        statusText.textContent = `It's ${currentPlayer}'s turn`;
        cells.forEach(cell => cell.textContent = "");
    };

    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    resetButton.addEventListener("click", resetBoard);
});
