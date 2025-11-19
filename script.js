'use strict';

function generateDrawingBoard() {
    cells = [];
    const cellWidth = drawingBoardSize / gridSize;

    const drawingBoard = document.createElement('div');
    drawingBoard.classList.add('drawing-board');

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

    drawingBoard.onmouseover = (e) => paintCell(e);
    drawingBoard.onmousedown = (e) => paintCell(e);

    gameContainer.appendChild(drawingBoard);
    return drawingBoard;
}

function paintCell(e) {
    // check whether the primary button was pressed
    if (+e.buttons != 1) {
        return;
    }

    const cellIndex = e.target.classList.item(1).split('cell')[1];
    let targetColor = getColor();

    cells[+cellIndex].style.backgroundColor = targetColor;
}

function toggleGrid() {
    isGridOn = !isGridOn;

    cells.forEach((item) => item.style.border = isGridOn ? '0.5px solid rgb(0, 0, 0)' : 'none');
}

function toggleDefaultMode(e) {
    changeColorMode('defaultMode');

    color = e.target.value;
}

function toggleRainbowMode() {
    changeColorMode('rainbowMode');

    if (colorModes.rainbowMode.isModeOn) {
        colorPicker.setAttribute('style', `background: linear-gradient(
        90deg,
        rgba(255, 0, 0, 1) 0%,
        rgba(255, 154, 0, 1) 10%,
        rgba(208, 222, 33, 1) 20%,
        rgba(79, 220, 74, 1) 30%,
        rgba(63, 218, 216, 1) 40%,
        rgba(47, 201, 226, 1) 50%,
        rgba(28, 127, 238, 1) 60%,
        rgba(95, 21, 242, 1) 70%,
        rgba(186, 12, 248, 1) 80%,
        rgba(251, 7, 217, 1) 90%,
        rgba(255, 0, 0, 1) 100%
        )`);
    } else {
        colorPicker.setAttribute('style', 'background-color: transparent');
    } 
}

function toggleEraserMode() {
    changeColorMode('eraserMode');

    if (colorModes.eraserMode.isModeOn) {
        colorPicker.setAttribute('style', 'background-color: white');        
    } else {
        colorPicker.setAttribute('style', 'background-color: transparent');
    }
}

function getRandomColor() {
    const rand = () => Math.floor(Math.random() * 256);
    return `rgb(${rand()}, ${rand()}, ${rand()})`; 
}

const drawingBoardSize = 500;
let gridSize = 16;
let cells = [];

const gameContainer = document.body.querySelector('.game-container');
const drawingBoard = generateDrawingBoard();
const optionsPanel = document.body.querySelector('.options-panel');

let isGridOn = false;
const gridBtn = optionsPanel.querySelector('.grid-btn');
gridBtn.onclick = () => toggleGrid();

const colorModes = {
    defaultMode: {
        isModeOn: true,
        getColor: () => color, 
    },
    rainbowMode: {
        isModeOn: false,
        getColor: () => getRandomColor(),        
    },
    eraserMode: {
        isModeOn: false,
        getColor: () => 'white',
    },
}
function changeColorMode(newMode) {
    if (newMode != 'defaultMode' && colorModes[newMode].isModeOn) {
        colorModes[newMode].isModeOn = false;
        colorModes.defaultMode.isModeOn = true;
        return;
    }

    for (const mode in colorModes) {
        colorModes[mode].isModeOn = (mode == newMode);
    }
}
function getColor() {
    let color;
    for (const mode in colorModes) {
        if (colorModes[mode].isModeOn) {
            color = colorModes[mode].getColor();
            break;
        }
    }
    return color;
}

let color = '#000000';
const colorPicker = optionsPanel.querySelector('.color-picker');
colorPicker.oninput = (e) => toggleDefaultMode(e);

const rainbowBtn = optionsPanel.querySelector('.rainbow-btn');
rainbowBtn.onclick = () => toggleRainbowMode();

const eraserBtn = optionsPanel.querySelector('.eraser-btn');
eraserBtn.onclick = () => toggleEraserMode();