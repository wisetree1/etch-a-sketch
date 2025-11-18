'use strict';

const cells = [];
const drawingBoard = document.body.querySelector('.drawing-board');

let gridSize = 16;

for (let i = 0; i < gridSize; i++) {
    const row = document.createElement('div');
    row.className = 'grid-row';

    for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement('div');
        cell.className = `grid-cell cell${gridSize * i + j}`;

        row.appendChild(cell);
        cells.push(cell);
    }
    drawingBoard.appendChild(row);
}

let lastCellIndex = '';
drawingBoard.addEventListener('mousemove', (e) => {
    const cellIndex = e.target.classList.item(1).split('cell')[1];
    if (cellIndex == lastCellIndex) {
        return;
    } else if (lastCellIndex != '') {
        cells[+lastCellIndex].classList.toggle('active');
    }
    lastCellIndex = cellIndex;

    cells[+cellIndex].classList.toggle('active');
});