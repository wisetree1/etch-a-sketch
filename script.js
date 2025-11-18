'use strict';

function generateDrawingBoard() {
    cells = [];

    const drawingBoard = document.createElement('div');
    drawingBoard.classList.add('drawing-board');

    const cellWidth = drawingBoardSize / gridSize;

    for (let i = 0; i < gridSize; i++) {
        const row = document.createElement('div');
        row.className = 'grid-row';

        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = `grid-cell cell${gridSize * i + j}`;
            cell.setAttribute('style', `width: ${cellWidth}px; height: ${cellWidth}px;`);

            row.appendChild(cell);
            cells.push(cell);
        }
        drawingBoard.appendChild(row);
    }

    drawingBoard.onmousemove = (e) => { paintCell(e) };
    drawingBoard.onmousedown = (e) => { paintCell(e) };

    gameContainer.appendChild(drawingBoard);
    return drawingBoard;
}

function paintCell(e) {
    // check whether the primary button was pressed
    if (+e.buttons != 1) {
        return;
    }

    const cellIndex = e.target.classList.item(1).split('cell')[1];
    cells[+cellIndex].style.backgroundColor = color;
}

function toggleGrid() {
    cells.forEach((item) => {
        item.style.border = isGridOn ? 'none' : '0.5px solid rgb(0, 0, 0)';
    });
    isGridOn = !isGridOn;
}

const drawingBoardSize = 500;
let gridSize = 16;
let cells = [];

const gameContainer = document.body.querySelector('.game-container');
const drawingBoard = generateDrawingBoard();
const optionsPanel = document.body.querySelector('.options-panel');

let color = '#000000';
const colorPicker = optionsPanel.querySelector('.color-picker');
colorPicker.oninput = (e) => { color = e.target.value };

let isGridOn = false;
const gridBtn = optionsPanel.querySelector('.grid-btn');
gridBtn.onclick = () => toggleGrid();