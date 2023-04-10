import { perlin2D } from '@leodeslf/perlin-noise';
import Spline from 'cubic-spline';

const dpr = window.devicePixelRatio || 1;

const canvasDots = document.getElementById('dots');
//const rectDots = canvasDots.getBoundingClientRect();
//canvasDots.width = rectDots.width * dpr;
//canvasDots.height = rectDots.height * dpr;
const contextDots = canvasDots.getContext('2d');
contextDots.scale(dpr, dpr);

//const contextPerlin = canvasPerlinNoise.getContext('2d');

let frame = 0;
let frameInitialOffset = 100000 * Math.random();
const totalCols = 200;
const totalRows = 20;
const smoothRatio = .025;

function getPerlinValues (shift) {
	const array = [];

	for (var y = 0; y < totalRows; y += 1){
		array[y] = [];
		for (var x = 0; x < totalCols; x += 1){
			array[y][x] = perlin2D((x + shift) * smoothRatio, y * smoothRatio * 5);
		}
	}

	return array;
}


function renderDots() {

	// only render every couple of frames

	//if (frame % 3 !== 0) {
	//	frame ++;
	//	window.requestAnimationFrame(render);
	//	return;
	//}

	//contextPerlin.clearRect(0, 0, 1000, 500);
	contextDots.clearRect(0, 0, 1500, 250);

	let shift = (frame + frameInitialOffset) * .3;

	// generate noise values

	//console.time('calculate perlin value');

	const noiseValues = getPerlinValues(shift);

	//console.timeEnd('calculate perlin value');

	// paint the noise canvas

	//console.time('paint noise');

	//for (let y = 0; y < noiseValues.length; y++) {
	//	for (let x = 0; x < noiseValues[y].length; x++) {
	//		const value = noiseValues[y][x];
	//		const rgb = (value * .5 + .5) * 255;
	//		contextPerlin.fillStyle = `rgb(${rgb},${rgb},${rgb})`;
	//		contextPerlin.fillRect(x * scale, y * scale, scale, scale);
	//	}
	//}

	//console.timeEnd('paint noise');

	// paint the dots

	//console.time('paint dots');

	const baseXScale = 2;
	const posXOffset  = 0;

	for (let y = 0; y < noiseValues.length; y++) {

		const rowRatio = (y + 1) / noiseValues.length;
		const invRowRatio = 1 - rowRatio;
		const opacity = 1 * rowRatio;
		contextDots.fillStyle = `rgba(0, 0, 0, ${opacity})`;

		const scaleX = baseXScale * (1 - .1 * invRowRatio);
		const totalRowWidth = noiseValues[y].length * scaleX;
		const maxRowWidth = noiseValues[y].length * baseXScale;
		const rowShift = maxRowWidth - totalRowWidth + posXOffset;

		//contextDots.beginPath();

		for (let x = 0; x < noiseValues[y].length; x++) {

			const noiseValue = noiseValues[y][x];

			// x
			const posX = (x * scaleX * 2) + rowShift;

			// y
			const offsetRow = 10 + (y * .5);
			const yScale = 10;
			const posY = yScale * noiseValue + (y * 3) + offsetRow;
			//contextDots.arc(posX, posY, 1, 0, 2 * Math.PI);
			contextDots.fillRect(posX, posY, 1, 1);
			//contextDots.closePath();
		}

		//contextDots.fill();
	}


	//console.timeEnd('paint dots');

	frame ++;

	window.requestAnimationFrame(renderDots)
}

window.requestAnimationFrame(renderDots);


const canvasLines = document.getElementById('lines');
const rectLines = canvasLines.getBoundingClientRect();
const contextLines = canvasLines.getContext('2d');



const totalLines = 3;
const dotMaxSpacing = 500;
const dotMinSpacing = 300;
const dotSpacingDiff = dotMaxSpacing - dotMinSpacing;
const maxHeight = 150;

function getLineDots () {
	const arrayX = [-50];
	const arrayY = [maxHeight / 2];

	let posX = 0;

	do {
		const spacingX = dotMinSpacing + (dotSpacingDiff * Math.random());
		posX = posX + spacingX;
		arrayX.push(posX);
		arrayY.push(maxHeight * Math.random());
	} while (posX <= rectLines.width)

	return {
		x: arrayX,
		y: arrayY
	};
}

function renderLines () {
	console.time('spline');


	const lines = [];

	for (let i = 0; i < totalLines; i++) {
		const dots = getLineDots();
		lines.push({
			dots,
			spline: new Spline(dots.x, dots.y)
		});
	}


	const offsetY = 50;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		contextLines.beginPath();
		contextLines.moveTo(line.dots.x[0], line.dots.y[0] + offsetY);

		for (let i = 0; i < rectLines.width; i++) {
			contextLines.lineTo(i, line.spline.at(i) + offsetY);
		}

		contextLines.stroke();
	}



	//for (let i = 1; i < dots.x.length; i++) {
	//	//contextLines.lineTo(dots.x[i], dots.y[i] + offsetY);
	//	//contextLines.bezierCurveTo(
	//	//	dots.x[i],
	//	//	dots.y[i - 1] + offsetY,
	//	//	dots.x[i -1 ],
	//	//	dots.y[i] + offsetY,
	//	//	dots.x[i], dots.y[i] + offsetY
	//	//)
	//}

	console.timeEnd('spline');
}

renderLines();