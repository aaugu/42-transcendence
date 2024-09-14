import createWebSocketConnection from './WebSocketConnection.js'
import handleButtons from './HandleButtons.js';
import handleKeyPress from './HandleKeyPress.js';
import updateGameState from './GameDraw.js';
import throttle from './Throttle.js';
import { canvasWidth, canvasHeight } from './GameConstants.js';

export async function displayGame(socket) {
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
							<span id="score-p-1">0</span>
							<span>:</span>
							<span id="score-p-2">0</span>
						</div>`;

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	socket.onopen = function(event) {
		console.log("WebSocket connection opened:", event);
	};

	socket.onclose = function(event) {
		console.log("WebSocket connection closed:", event);
	};

	socket.onerror = function(error) {
		console.error("WebSocket error:", error);
	};

	socket.onmessage = function (event) {
		// console.log("Raw message received:", event.data);
		try {
			const data = JSON.parse(event.data);
			// console.log("Parsed data:", data);

			if (data.game_state) {
				// console.log("Game State", data.game_state);
				updateGameState(data.game_state, canvas);
			}

			if (data.game_finished) {
				console.log("Game Finished", data.game_finished);
				console.log("WinnerID", data.winner_id);
				console.log("LoserID", data.loser_id);
			}
		} catch (error) {
			console.error("Error parsing message:", error);
			console.log("Raw message that caused error:", event.data);
		}
	};

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
	// start = true
}