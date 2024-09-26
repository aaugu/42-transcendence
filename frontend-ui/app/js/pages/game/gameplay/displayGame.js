import updateGameState from './GameDraw.js';
import throttle from './Throttle.js';
import { canvasWidth, canvasHeight } from './GameConstants.js';
import HandleButtons from './HandleButtons.js';
import handleKeyPress from './HandleKeyPress.js';

export function displayGame() {
	const canvas = document.getElementById("pongCanvas");
	const infoCtn = document.querySelector(".info-ctn");

	const right_player = localStorage.getItem('right');
	const left_player = localStorage.getItem('left');

	canvas.classList.remove("hidden");
	infoCtn.innerHTML = '';
	infoCtn.innerHTML = `<div>
							<button class="btn btn-dark" id="start-button">Start</button>
							<button class="btn btn-dark" id="stop-button">Stop</button>
							<button class="btn btn-light" id="reset-button">Reset</button>
						</div>
						<div>
							<span id="player1"></span>
							<span id="score-p-1">0</span>
							<span>:</span>
							<span id="score-p-2">0</span>
							<span id="player2"></span>
						</div>`;

	console.log("right player and left player: ", right_player, left_player);

	if (right_player && left_player) {
		document.getElementById('player1').innerText = left_player;
		document.getElementById('player2').innerText = right_player;
	}
	else {
		return null;
	}

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	return canvas;
}