'use strict';

let cells = [];

function generateDrawingBoard(parentNode, beforeNode, gridSize, isGridOn, brushSize = 1) {
    cells = [];

    let oldDrawingBoard = parentNode.querySelector('.drawing-board');
    if (oldDrawingBoard) {
        parentNode.removeChild(oldDrawingBoard);
    }
    const drawingBoard = document.createElement('div');
    drawingBoard.classList.add('drawing-board');
    drawingBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    drawingBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = `grid-cell cell${i % gridSize + Math.floor(i / gridSize) * gridSize}`;
        cell.style.border = isGridOn ? '0.5px solid rgb(0, 0, 0)' : 'none';

        cells.push(cell);
        drawingBoard.appendChild(cell);
    }

    setDrawingBoardListeners(drawingBoard, gridSize, brushSize);

    beforeNode.after(drawingBoard);
    return drawingBoard;
}

function setDrawingBoardListeners(drawingBoard, gridSize, brushSize) {
    drawingBoard.onmouseover = (e) => paintCell(e, gridSize, brushSize);
    drawingBoard.onmousedown = (e) => paintCell(e, gridSize, brushSize);
}

function clearDrawingBoard() {
    cells.forEach((item) => item.style.backgroundColor = 'white');
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

function paintCell(e, gridSize, brushSize) {
    // check whether the primary button was pressed or not
    if (+e.buttons != 1) {
        return;
    }

    const cellIndex = Number(e.target.classList.item(1).split('cell')[1]);
    let targetColor = getColor();

    paintSquare(cellIndex, gridSize, brushSize, targetColor);
}

function paintSquare(cellIndex, gridSize, brushSize, targetColor) {
    const cellRow = Math.floor(cellIndex / gridSize);
    const cellColumn = cellIndex % gridSize;
    const cellOffset = Math.floor(brushSize / 2);

    let columnLeft = cellColumn;
    while (columnLeft > 0 && columnLeft > cellColumn - cellOffset) {
        columnLeft--;
    }

    let columnRight = cellColumn;
    while (columnRight < gridSize - 1 && columnRight < cellColumn + cellOffset) {
        columnRight++;
    }
    
    let rowTop = cellRow;
    while (rowTop > 0 && rowTop > cellRow - cellOffset) {
        rowTop--;
    }

    let rowBottom = cellRow;
    while (rowBottom < gridSize - 1 && rowBottom < cellRow + cellOffset) {
        rowBottom++;
    }

    for (let r = rowTop; r <= rowBottom; r++) {
        for (let c = columnLeft; c <= columnRight; c++) {
            cells[r * gridSize + c].style.backgroundColor = targetColor;
        }
    }
}

function toggleGrid(isGridOn, gridBtn) {
    let newGridOn = !isGridOn;
    cells.forEach((item) => {
        item.style.border = newGridOn ? '0.5px solid rgb(0, 0, 0)' : 'none';
    });

    gridBtn.classList.toggle('btn-active');
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

const sizeArea = gameContainer.querySelector('.size-area');
let gridSize = 16;
let brushSize = 1;

let drawingBoard = generateDrawingBoard(gameContainer, sizeArea, gridSize, false);

const gridSizeArea = sizeArea.querySelector('.grid-size-area');
const gridSizeLabel = gridSizeArea.querySelector('.size-label');
const gridSizeInputElement = gridSizeArea.querySelector('input');
gridSizeInputElement.oninput = (e) => { 
    gridSize = +e.target.value; 
    gridSizeLabel.textContent = `${gridSize} x ${gridSize}`; 
    drawingBoard = generateDrawingBoard(gameContainer, sizeArea, gridSize, isGridOn, brushSize);
};

const brushSizeArea = sizeArea.querySelector('.brush-size-area');
const brushSizeLabel = brushSizeArea.querySelector('.size-label');
const brushSizeInputElement = brushSizeArea.querySelector('input');
brushSizeInputElement.oninput = (e) => { 
    brushSize = +e.target.value; 
    brushSizeLabel.textContent = `${brushSize} x ${brushSize}`;
    setDrawingBoardListeners(drawingBoard, gridSize, brushSize);
};

const optionsPanel = document.body.querySelector('.options-panel');
let isGridOn = false;
const gridBtn = optionsPanel.querySelector('.grid-btn');
gridBtn.onclick = () => { isGridOn = toggleGrid(isGridOn, gridBtn); };

let color = '#000000';
const colorPicker = optionsPanel.querySelector('.color-picker');
colorPicker.oninput = (e) => { color = toggleDefaultMode(e); };

const rainbowBtn = optionsPanel.querySelector('.rainbow-btn');
rainbowBtn.onclick = () => changeColorMode('rainbowMode');

const eraserBtn = optionsPanel.querySelector('.eraser-btn');
eraserBtn.onclick = () => changeColorMode('eraserMode');

const colorModes = {
    defaultMode: {
        isModeOn: true,
        getColor: () => color, 
        button: colorPicker,
    },
    rainbowMode: {
        isModeOn: false,
        getColor: () => getRandomColor(),        
        button: rainbowBtn,
    },
    eraserMode: {
        isModeOn: false,
        getColor: () => 'white',
        button: eraserBtn,
    },
}

function changeColorMode(newMode) {
    if (newMode != 'defaultMode' && colorModes[newMode].isModeOn) {
        colorModes[newMode].isModeOn = false;
        colorModes[newMode].button.classList.remove('btn-active'); 

        colorModes.defaultMode.isModeOn = true;
        return;
    }
    
    colorModes[newMode].isModeOn = true;
    colorModes[newMode].button.classList.add('btn-active');
    for (const mode in colorModes) {
        if (mode == newMode) {
            continue;
        } 
        colorModes[mode].isModeOn = false;
        colorModes[mode].button.classList.remove('btn-active');
    }
}

const clearBtn = optionsPanel.querySelector('.clear-btn');
clearBtn.onclick = () => clearDrawingBoard();
