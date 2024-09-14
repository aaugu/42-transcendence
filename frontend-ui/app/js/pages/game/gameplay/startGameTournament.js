import createWebSocketConnection from './WebSocketConnection.js'
import handleButtons from './HandleButtons.js';
import handleKeyPress from './HandleKeyPress.js';
import updateGameState from './GameDraw.js';
import throttle from './Throttle.js';
import { canvasWidth, canvasHeight } from './GameConstants.js';
import { Tournament } from '../tournament/tournamentClass.js';

export var socket;



export async function startGameTournament() {
	const tourn_id = localStorage.getItem('tourn_id');
    localStorage.removeItem('tourn_id');
	const tournament = new Tournament(tourn_id);
	tournament.launchTournament();

	socket = await createWebSocketConnection();
	console.log("FUNCTION START GAME");

	const canvas = document.getElementById("pongCanvas");
	const infoCtn = document.querySelector(".info-ctn");
	infoCtn.innerHTML = "";
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

	socket.onopen = function(event) {
		console.log("WebSocket connection opened:", event);
		document.getElementById("player1").innerText = tournament.current_match.player1.nickname;
		document.getElementById("player2").innerText = tournament.current_match.player2.nickname;
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
				const winner = (data.winner_id === 1) ? current_match.player1 : current_match.player2

				tournament.updateMatchCycle(winner.id);
				if (tournament.game_status === 1) {
					const t_matchmodal = new bootstrap.Modal(document.getElementById('t-match-modal'));
					document.getElementById("t-match-text").innerText = `The winner is: ${winner.nickname}. Next match: ${tournament.current_match.player1.nickname} vs ${tournament.current_match.player2.nickname}`;
					document.getElementById("t-match-go").onclick = async function() {
						//reset game state and start next match
						//hide modal
					};
					t_matchmodal.show();
				}
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