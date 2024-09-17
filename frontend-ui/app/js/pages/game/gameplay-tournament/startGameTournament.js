import createWebSocketConnection from '../gameplay/WebSocketConnection.js'
import handleButtons from '../gameplay/HandleButtons.js';
import handleKeyPress from '../gameplay/HandleKeyPress.js';
import updateGameState from '../gameplay/GameDraw.js';
import throttle from '../gameplay/Throttle.js';
import { canvasWidth, canvasHeight } from '../gameplay/GameConstants.js';
import { Tournament } from './tournamentClass.js';
import { displayGame } from '../gameplay/displayGame.js';
import { handleWebsocketTournament } from '../gameplay/handleWebsocket.js';
import { urlRoute } from '../../../dom/router.js';

export var t_socket;

export async function startGameTournament() {
	const tourn_id = window.location.href.split("/")[4];
	console.log("tourn id: ", tourn_id);

	const tournament = new Tournament(tourn_id);
	await tournament.launchTournament();

	if (tournament.game_status === 1) {
		t_socket = new WebSocket(`ws://localhost:9000/ws/pong/tournament/${tourn_id}`);
		if (!t_socket)
			return; //error handling if game id cannot be created

		console.log("FUNCTION START TOURNAMENT GAME");

		const canvas = displayGame();
		handleWebsocketTournament(t_socket, tournament, canvas);
		handleButtons(t_socket);

		let keysPressed = {}

		document.addEventListener("keydown", function (event) {
			keysPressed[event.key] = true;
			handleKeyPress(keysPressed, t_socket);
		});

		document.addEventListener("keyup", function (event) {
			keysPressed[event.key] = false;
			handleKeyPress(keysPressed, t_socket);
		});
	}
	else if (tournament.game_status === 2) {
		urlRoute('/tournament');
		errormsg("Tournament already finished", "homepage-errormsg");
	}
}