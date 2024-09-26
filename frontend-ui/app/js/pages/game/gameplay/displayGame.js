import updateGameState from './GameDraw.js';
import throttle from './Throttle.js';
import { canvasWidth, canvasHeight } from './GameConstants.js';
import HandleButtons from './HandleButtons.js';
import handleKeyPress from './HandleKeyPress.js';

export function displayGame() {
	const url = window.location.href;

	const mode = url.split("/")[3];
	console.log("MODE IN DISPLAY GAME: ", mode);
	
	const canvas = document.getElementById("pongCanvas");
	const infoCtn = document.querySelector(".info-ctn");

	canvas.classList.remove("hidden");

	let buttonsHTML = '';
	if (mode != 'remote-twoplayer' && mode != 'tournament-remote') {
		buttonsHTML = `<button class="btn btn-dark" id="start-button">Start</button>
									 <button class="btn btn-dark" id="stop-button">Stop</button>`;
	}

	infoCtn.innerHTML = '';
	infoCtn.innerHTML = `<div>
							${buttonsHTML}
						</div>
						<div>
							<span id="player1"></span>
							<span id="score-p-1">0</span>
							<span>:</span>
							<span id="score-p-2">0</span>
							<span id="player2"></span>
						</div>`;

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	return canvas;
}