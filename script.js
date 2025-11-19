'use strict';

function generateDrawingBoard() {
    cells = [];
    const cellWidth = drawingBoardSize / gridSize;

    let oldDrawingBoard = gameContainer.querySelector('.drawing-board');
    if (oldDrawingBoard) {
        gameContainer.removeChild(oldDrawingBoard);
    }
    const drawingBoard = document.createElement('div');
    drawingBoard.classList.add('drawing-board');

    for (let i = 0; i < gridSize; i++) {
        const row = document.createElement('div');
        row.className = 'grid-row';

        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = `grid-cell cell${gridSize * i + j}`;
            cell.setAttribute('style', `width: ${cellWidth}px; height: ${cellWidth}px;`);
            cell.style.border = isGridOn ? '0.5px solid rgb(0, 0, 0)' : 'none'

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

function clearDrawingBoard() {
    cells.forEach((item) => item.style.backgroundColor = 'white');
}

function paintCell(e) {
    // check whether the primary button was pressed or not
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
    colorPicker.style.background = color;
}

function toggleRainbowMode() {
    changeColorMode('rainbowMode');

    if (colorModes.rainbowMode.isModeOn) {
        colorPicker.style.background = `linear-gradient(
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
        )`;
    } else {
        colorPicker.style.background = 'transparent';
    } 
}

function toggleEraserMode() {
    changeColorMode('eraserMode');

    if (colorModes.eraserMode.isModeOn) {
        colorPicker.style.background = 'white';
    } else {
        colorPicker.style.background = 'transparent';
    }
}

function getRandomColor() {
    const rand = () => Math.floor(Math.random() * 256);
    return `rgb(${rand()}, ${rand()}, ${rand()})`; 
}

let cells = [];
const drawingBoardSize = 500;
let gridSize = 16;
let isGridOn = false;

const gameContainer = document.body.querySelector('.game-container');
const drawingBoard = generateDrawingBoard();
const optionsPanel = document.body.querySelector('.options-panel');

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

const clearBtn = optionsPanel.querySelector('.clear-btn');
clearBtn.onclick = () => clearDrawingBoard();

const gridSizeArea = optionsPanel.querySelector('.grid-size-area');
const gridSizeLabel = gridSizeArea.querySelector('label');
const gridSizeInputElement = gridSizeArea.querySelector('input');
gridSizeInputElement.oninput = (e) => { gridSize = e.target.value; gridSizeLabel.textContent = `${gridSize} * ${gridSize}`; generateDrawingBoard(); };