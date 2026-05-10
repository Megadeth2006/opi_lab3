
window.existingPoints = window.existingPoints || [];

function handleRemoteCommandComplete(args) {
    if (args && args.pointsJson) {
        try {
            window.existingPoints = JSON.parse(args.pointsJson);
        } catch(e) {
            window.existingPoints = [];
            console.error('parse pointsJson failed', e);
        }
    } else {
        window.existingPoints = [];
    }

    const svg = document.querySelector(".graph-panel svg");
    if (svg) {
        svg.querySelectorAll('circle').forEach(c => c.remove());
    }

    console.log('Loaded points:', existingPoints);
    drawAll();
}

function draw(x, y, inArea) {
    const SCALE = 70;
    const CENTER = 225;
    
    const cx = x * SCALE + CENTER;
    const cy = -y * SCALE + CENTER;

    const fillColor = inArea ? "#09a53d" : "#a50909";

    const svg = document.querySelector(".graph-panel svg");
    if (!svg) return;
    
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", "5");
    circle.setAttribute("fill", fillColor);
    circle.setAttribute("fill-opacity", "0.9");
    circle.setAttribute("stroke", "firebrick");
    svg.appendChild(circle);
}

function drawAll() {
    if (!window.existingPoints) return;

    window.existingPoints.forEach(p => {
        const { x, y, inArea } = p;
        draw(x, y, inArea);
    });
}


function syncHiddenY() {
    let yInput = document.getElementById("yInput");
    if (yInput) {
        document.getElementById("hiddenY").value = yInput.value.replace(",", ".");
    }
}

function syncHiddenR() {
    let rInput = document.getElementById("rInput");
    if (rInput) {
        document.getElementById("hiddenR").value = rInput.value.replace(",", ".");
    }
}

function updateHiddenX() {
    const boxes = document.querySelectorAll('input[type="checkbox"][data-x]');
    let selected = [];
    boxes.forEach(cb => {
        if (cb.checked) selected.push(cb.dataset.x);
    });
    document.getElementById("hiddenX").value = selected.join(",");
}


function clearHiddenInputs() {
    const hiddenY = document.getElementById("hiddenY");
    const hiddenR = document.getElementById("hiddenR");
    
    if (hiddenY) hiddenY.value = "";
    if (hiddenR) hiddenR.value = "";
    
    const yInput = document.getElementById("yInput");
    if (yInput) yInput.value = "";
}


function drawAxes(r) {
    const SCALE = 70;
    const CENTER = 225;
    const SVG_SIZE = 450;
    
    const svg = document.querySelector('.graph-panel svg');
    if (!svg) return;
    
    // удаляем старые оси
    const oldAxes = svg.querySelector('#axes-group');
    if (oldAxes) {
        svg.removeChild(oldAxes);
    }
    
    const axesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    axesGroup.setAttribute('id', 'axes-group');
    
    // оси
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', '0');
    xAxis.setAttribute('y1', CENTER);
    xAxis.setAttribute('x2', SVG_SIZE);
    xAxis.setAttribute('y2', CENTER);
    xAxis.setAttribute('stroke', 'black');
    xAxis.setAttribute('stroke-width', '2');
    
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', CENTER);
    yAxis.setAttribute('y1', '0');
    yAxis.setAttribute('x2', CENTER);
    yAxis.setAttribute('y2', SVG_SIZE);
    yAxis.setAttribute('stroke', 'black');
    yAxis.setAttribute('stroke-width', '2');
    
    // Стрелки
    const xArrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    xArrow.setAttribute('points', `${SVG_SIZE},${CENTER} ${SVG_SIZE-10},${CENTER-5} ${SVG_SIZE-10},${CENTER+5}`);
    xArrow.setAttribute('fill', 'black');
    
    const yArrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    yArrow.setAttribute('points', `${CENTER},0 ${CENTER-5},10 ${CENTER+5},10`);
    yArrow.setAttribute('fill', 'black');
    
    // подписи осей
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', SVG_SIZE - 15);
    xLabel.setAttribute('y', CENTER - 10);
    xLabel.setAttribute('font-size', '14');
    xLabel.textContent = 'x';
    
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', CENTER + 10);
    yLabel.setAttribute('y', '15');
    yLabel.setAttribute('font-size', '14');
    yLabel.textContent = 'y';
    
    axesGroup.appendChild(xAxis);
    axesGroup.appendChild(yAxis);
    axesGroup.appendChild(xArrow);
    axesGroup.appendChild(yArrow);
    axesGroup.appendChild(xLabel);
    axesGroup.appendChild(yLabel);
    
    // Деления и метки, если R задан
    if (r && r > 0) {
        const rPix = r * SCALE;
        const r2Pix = rPix / 2;
        
        // X положительные
        drawTick(axesGroup, CENTER + r2Pix, CENTER - 5, CENTER + r2Pix, CENTER + 5, 'R/2', CENTER + r2Pix - 10, CENTER - 10);
        drawTick(axesGroup, CENTER + rPix, CENTER - 5, CENTER + rPix, CENTER + 5, 'R', CENTER + rPix - 5, CENTER - 10);
        
        // X отрицательные
        drawTick(axesGroup, CENTER - r2Pix, CENTER - 5, CENTER - r2Pix, CENTER + 5, '-R/2', CENTER - r2Pix - 15, CENTER - 10);
        drawTick(axesGroup, CENTER - rPix, CENTER - 5, CENTER - rPix, CENTER + 5, '-R', CENTER - rPix - 10, CENTER - 10);
        
        // Y положительные
        drawTick(axesGroup, CENTER - 5, CENTER - r2Pix, CENTER + 5, CENTER - r2Pix, 'R/2', CENTER + 10, CENTER - r2Pix + 5);
        drawTick(axesGroup, CENTER - 5, CENTER - rPix, CENTER + 5, CENTER - rPix, 'R', CENTER + 10, CENTER - rPix + 5);
        
        // Y отрицательные
        drawTick(axesGroup, CENTER - 5, CENTER + r2Pix, CENTER + 5, CENTER + r2Pix, '-R/2', CENTER + 10, CENTER + r2Pix + 5);
        drawTick(axesGroup, CENTER - 5, CENTER + rPix, CENTER + 5, CENTER + rPix, '-R', CENTER + 10, CENTER + rPix + 5);
    }
    
    svg.insertBefore(axesGroup, svg.firstChild);
}

function drawTick(parent, x1, y1, x2, y2, label, textX, textY) {
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('x1', x1);
    tick.setAttribute('y1', y1);
    tick.setAttribute('x2', x2);
    tick.setAttribute('y2', y2);
    tick.setAttribute('stroke', 'black');
    tick.setAttribute('stroke-width', '1');
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', textX);
    text.setAttribute('y', textY);
    text.setAttribute('font-size', '12');
    text.textContent = label;
    
    parent.appendChild(tick);
    parent.appendChild(text);
}

function updateGraph(rValue) {
    const SCALE = 70;
    const CENTER = 225;
    
    const svg = document.querySelector('.graph-panel svg');
    if (!svg) return;

    const r = parseFloat(rValue);
    
    // Отрисовываем оси с текущим R
    drawAxes(r);
    
    // Удаляем предыдущую область
    const oldGroup = svg.querySelector('#r-shape');
    if (oldGroup) {
        svg.removeChild(oldGroup);
    }
    
    if (isNaN(r) || r <= 0) return;
    
    const rPix = r * SCALE;
    
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', 'r-shape');

    // Прямоугольник (I четверть: x > 0, y > 0)
    // От 0 до R по X, от 0 до R/2 по Y
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const rectWidth = rPix;
    const rectHeight = rPix / 2;
    rect.setAttribute('x', CENTER);
    rect.setAttribute('y', CENTER - rectHeight);
    rect.setAttribute('width', rectWidth);
    rect.setAttribute('height', rectHeight);
    rect.setAttribute('fill-opacity', '0.4');
    rect.setAttribute('stroke', 'navy');
    rect.style.fill = 'blue !important';
    
    // Четверть окружности (IV четверть: x > 0, y < 0)
    // Радиус R/2
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const r2Pix = rPix / 2;
    const circleStartX = CENTER + r2Pix;  // x = R/2, y = 0
    const circleStartY = CENTER;
    const circleEndX = CENTER;            // x = 0, y = -R/2
    const circleEndY = CENTER + r2Pix;
    path.setAttribute('d',
        `M ${CENTER} ${CENTER} L ${circleStartX} ${circleStartY} A ${r2Pix} ${r2Pix} 0 0 1 ${circleEndX} ${circleEndY} Z`
    );
    path.setAttribute('fill-opacity', '0.4');
    path.setAttribute('stroke', 'navy');
    path.style.fill = 'blue !important';

    // Треугольник (II четверть: x < 0, y > 0)
    // Вершины: (0,0), (-R,0), (0,R)
    const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    triangle.setAttribute('points',
        `${CENTER},${CENTER} ${CENTER - rPix},${CENTER} ${CENTER},${CENTER - rPix}`
    );
    triangle.setAttribute('fill-opacity', '0.4');
    triangle.setAttribute('stroke', 'navy');
    triangle.style.fill = 'blue !important';

    group.appendChild(rect);
    group.appendChild(path);
    group.appendChild(triangle);

    svg.appendChild(group);
    
    // Обновляем точки с новым R
    if (typeof updateRCommand !== 'undefined') {
        updateRCommand([{ name: 'maxR', value: r }]);
}
}


function handleSvgClick(event) {
    const SCALE = 70;
    const CENTER = 225;

    // Получаем текущее значение R из поля ввода
    const rInput = document.getElementById('rInput');
    if (!rInput || !rInput.value || rInput.value.trim() === '') {
        showError("R must be entered");
        return;
    }
    
    const rValue = parseFloat(rInput.value.replace(',', '.'));
    if (isNaN(rValue) || rValue < 1 || rValue > 4) {
        showError("R must be between 1 and 4");
        return;
    }

    // Получаем координаты клика относительно SVG
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const x = (offsetX - CENTER) / SCALE;
    const y = (CENTER - offsetY) / SCALE;

    // утанавливаем значения в скрытые поля
    document.getElementById("hiddenX").value = x.toFixed(10);
    document.getElementById("hiddenY").value = y.toFixed(10);
    document.getElementById('hiddenR').value = rValue;

    // отправляем запрос на сервер (обрабатываем только скрытые поля, пропускаем валидацию yInput и rInput)
    PrimeFaces.ab({
        source: 'submitBtn',
        process: 'submitBtn hiddenX hiddenY hiddenR',
        update: 'input-form @form :responsesForm',
        oncomplete: function(xhr, status, args) {
            document.getElementById('hiddenR').value = '';
            resetHiddenRCommand();
            updateRCommand([{ name: 'maxR', value: rValue }]);
            clearHiddenInputs();
        }
    });
}


window.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing draw.js");
    

    drawAxes(null);
    

    const xCheckboxes = document.querySelectorAll('input[type="checkbox"][data-x]');
    xCheckboxes.forEach(cb => {
            cb.addEventListener("change", updateHiddenX);
        });


    const rInput = document.getElementById('rInput');
    if (rInput) {

        rInput.addEventListener('input', function() {
            syncHiddenR();
            updateGraph(this.value);
        });

        if (rInput.value) {
        updateGraph(rInput.value);
    }
}

    const svg = document.querySelector(".graph-panel svg");
    if (svg) {
        svg.addEventListener("click", handleSvgClick);
        svg.style.cursor = "crosshair";
    }


    const currentR = rInput ? rInput.value : 0;
    if (typeof updateRCommand !== 'undefined' && currentR > 0) {
        updateRCommand([{ name: 'maxR', value: currentR }]);
        }
    });
