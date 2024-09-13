import createWebSocketConnection from './WebSocketConnection.js'
import handleButtons from './HandleButtons.js';
import handleKeyPress from './HandleKeyPress.js';
import updateGameState from './GameDraw.js';
import throttle from './Throttle.js';
import { canvasWidth, canvasHeight } from './GameConstants.js';
import { generateMatches, startMatch, endMatch } from '../../tournament/match.js';
import { startTournament } from '../../tournament/startTournament.js';

export var socket;

function getNextMatch(matches) {

	if (matches === null)
		return null;
	return matches.find(match => match.status === "Not played") || null;
}

async function launchTournament(tourn_id) {
	try {
		const response = await generateMatches(tourn_id, 'POST');
        await startTournament(tourn_id);
		return response.matches;
	}
	catch (e) {
		console.error(`TOURNAMENT LOG: ERROR STARTING TOURNAMENT: ${e.message}`);
		return null;
	}
}

function sendPlayerDataToGame(match) {
	const player1 = match.player1;
	const player2 = match.player2;
	const playerData = {
		"player1": player1.user_id,
		"player2": player2.user_id
	};
	const message = JSON.stringify(playerData);
	socket.send(message);
}

async function updateMatches(tourn_id, winner) {
	try {
		await endMatch(tourn_id, winner);
		const upd_matches = await generateMatches(tourn_id, 'GET');

		return upd_matches;
	}
	catch (e) {
		console.error(`TOURNAMENT LOG: ERROR UPDATING MATCHES: ${e.message}`);
		return null;
	}
}

export async function playTournament() {
	const tourn_id = localStorage.getItem('tourn_id');
    localStorage.removeItem('tourn_id');
	const canvas = document.getElementById("pongCanvas");
	const infoCtn = document.querySelector(".info-ctn");
	const all_matches = await launchTournament(tourn_id);
	const first_match = getNextMatch(all_matches);
	if (first_match === null) {
		console.log("TOURNAMENT LOG: No match to start");
		return;
	}

	socket = await createWebSocketConnection();
	console.log("FUNCTION START GAME");

	infoCtn.innerHTML = "";
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
		sendPlayerDataToGame(first_match);
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

				const upd_matches = updateMatches(tourn_id, data.winner_id);
				const next_match = getNextMatch(upd_matches);
				if (next_match !== null)
					sendPlayerDataToGame(next_match);
				//si c'est null == fin du tournament
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