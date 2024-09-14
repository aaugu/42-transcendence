import updateGameState from './GameDraw.js';
import throttle from './Throttle.js';
import { canvasWidth, canvasHeight } from './GameConstants.js';

export async function displayGame() {
	const canvas = document.getElementById("pongCanvas");
	const infoCtn = document.querySelector(".info-ctn");
	console.log("FUNCTION START GAME");

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

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

}