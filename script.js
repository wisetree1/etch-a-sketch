'use strict';

let cells = [];

function generateDrawingBoard(parentNode, beforeNode, gridSize, isGridOn) {
    cells = [];

    let oldDrawingBoard = parentNode.querySelector('.drawing-board');
    if (oldDrawingBoard) {
        parentNode.removeChild(oldDrawingBoard);
    }
    const drawingBoard = document.createElement('div');
    drawingBoard.classList.add('drawing-board');
    drawingBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    drawingBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    drawingBoard.style.outline = isGridOn ? 'none' : '0.5px solid rgb(0, 0, 0)';

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = `grid-cell cell${i % gridSize + Math.floor(i / gridSize) * gridSize}`;
        cell.style.border = isGridOn ? '0.5px solid rgb(0, 0, 0)' : 'none';

        cells.push(cell);
        drawingBoard.appendChild(cell);
    }

    drawingBoard.onmouseover = (e) => paintCell(e);
    drawingBoard.onmousedown = (e) => paintCell(e);

    beforeNode.after(drawingBoard);
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

function toggleGrid(isGridOn, drawingBoard) {
    let newGridOn = !isGridOn;
    cells.forEach((item) => {
        item.style.border = newGridOn ? '0.5px solid rgb(0, 0, 0)' : 'none';
    });

    drawingBoard.style.outline = newGridOn ? 'none' : '0.5px solid rgb(0, 0, 0)';
    return newGridOn;
}

function toggleDefaultMode(e) {
    changeColorMode('defaultMode');

    return e.target.value;
}

function getRandomColor() {
    const rand = () => Math.floor(Math.random() * 256);
    return `rgb(${rand()}, ${rand()}, ${rand()})`; 
}

const gameContainer = document.body.querySelector('.game-container');
let gridSize = 16;

const gridSizeArea = gameContainer.querySelector('.grid-size-area');
const gridSizeLabel = gridSizeArea.querySelector('label');
const gridSizeInputElement = gridSizeArea.querySelector('input');
gridSizeInputElement.oninput = (e) => { 
    gridSize = e.target.value; 
    gridSizeLabel.textContent = `${gridSize} * ${gridSize}`; 
    drawingBoard = generateDrawingBoard(gameContainer, gridSizeArea, gridSize, isGridOn);
};

let drawingBoard = generateDrawingBoard(gameContainer, gridSizeArea, gridSize, false);

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

const optionsPanel = document.body.querySelector('.options-panel');
let isGridOn = false;
const gridBtn = optionsPanel.querySelector('.grid-btn');
gridBtn.onclick = () => { isGridOn = toggleGrid(isGridOn, drawingBoard); };

let color = '#000000';
const colorPicker = optionsPanel.querySelector('.color-picker');
colorPicker.oninput = (e) => { color = toggleDefaultMode(e); };

const rainbowBtn = optionsPanel.querySelector('.rainbow-btn');
rainbowBtn.onclick = () => changeColorMode('rainbowMode');

const eraserBtn = optionsPanel.querySelector('.eraser-btn');
eraserBtn.onclick = () => changeColorMode('eraserMode');

const clearBtn = optionsPanel.querySelector('.clear-btn');
clearBtn.onclick = () => clearDrawingBoard();
