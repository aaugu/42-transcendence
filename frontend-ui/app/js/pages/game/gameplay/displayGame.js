import updateGameState from './GameDraw.js';
import throttle from './Throttle.js';
import { canvasWidth, canvasHeight } from './GameConstants.js';
import HandleButtons from './HandleButtons.js';
import handleKeyPress from './HandleKeyPress.js';

export function displayGame() {
	const canvas = document.getElementById("pongCanvas");
	const infoCtn = document.querySelector(".info-ctn");

	canvas.classList.remove("hidden");
	infoCtn.innerHTML = '';
	infoCtn.innerHTML = `<div>
							<button class="btn btn-dark" id="start-button">Start</button>
							<button class="btn btn-dark" id="stop-button">Stop</button>
							<button class="btn btn-light" id="reset-button">Reset</button>
						</div>
						</br>
						<div>
							<span id="score-p-1">0</span>
							<span>:</span>
							<span id="score-p-2">0</span>
						</div>
						</br>
						<div>
							<span id="player1">Player 1</span>
							<span> VS </span>
							<span id="player2">Player 2</span>
						</div>
						<div class="justify-content-between">
							<span>(F - V)</span>
							<span>(N - J)</span>
						</div>`;

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	return canvas;
}