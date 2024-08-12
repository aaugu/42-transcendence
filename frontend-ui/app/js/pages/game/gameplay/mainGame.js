import createWebSocketConnection from './WebSocketConnection.js'
import handleButtons from './HandleButtons.js';
import handleKeyPress from './HandleKeyPress.js';
import updateGameState from './GameDraw.js';
import throttle from './Throttle.js';
import { canvasWidth, canvasHeight } from './GameConstants.js';

export async function mainGame (event) {
	const canvas = document.getElementById("pongCanvas");
	const infoCtn = document.querySelector(".info-ctn");
	// const socket = createWebSocketConnection();

	infoCtn.innerHTML = "";
	infoCtn.innerHTML = `<div>
							<button class="btn btn-dark" id="start-button">Start</button>
							<button class="btn btn-dark" id="stop-button">Stop</button>
							<button class="btn btn-dark" id="reset-button">Reset</button>
						</div>
						<div>
							<span id="score-p-1">0</span>
							<span>:</span>
							<span id="score-p-2">0</span>
						</div>`;


	console.log("in main.js", canvasWidth, canvasHeight);

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	// socket.onmessage = function (event) {
	// 	const data = JSON.parse(event.data);
	// 	if (data.game_state) {
	// 	updateGameState(data.game_state, canvas);
	// 	}
	// };

	const startButton = document.getElementById("start-button");
	const stopButton = document.getElementById("stop-button");
	const resetButton = document.getElementById("reset-button");

	handleButtons(startButton, stopButton, resetButton, socket);

	let keysPressed = {}

	document.addEventListener("keydown", function (event) {
		keysPressed[event.key] = true;
		handleKeyPress(keysPressed, socket);
	});

	document.addEventListener("keyup", function (event) {
		keysPressed[event.key] = false;
		handleKeyPress(keysPressed, socket);
	});
}