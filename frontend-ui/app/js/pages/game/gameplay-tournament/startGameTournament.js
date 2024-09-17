import createWebSocketConnection from '../gameplay/WebSocketConnection.js'
import handleButtons from '../gameplay/HandleButtons.js';
import handleKeyPress from '../gameplay/HandleKeyPress.js';
import updateGameState from '../gameplay/GameDraw.js';
import throttle from '../gameplay/Throttle.js';
import { canvasWidth, canvasHeight } from '../gameplay/GameConstants.js';
import { Tournament } from './tournamentClass.js';
import { displayGame } from '../gameplay/displayGame.js';
import { handleWebsocketTournament } from '../gameplay/handleWebsocket.js';
import { getTournamentDetails } from '../../tournament/getTournaments.js';
import { urlRoute } from '../../../dom/router.js';
import { errormsg } from '../../../dom/errormsg.js';

export var t_socket;

export async function startGameTournament() {
	const tourn_id = window.location.href.split("/")[4];
	let tournament;
	let gameState = { current: null };
	let t_details;

	try {
		t_details = await getTournamentDetails(tourn_id);
	} catch (e) {
		urlRoute('/tournament');
		errormsg(e.message, "homepage-errormsg");
		return;
	}
	if (t_details.status === 'In Progress') {
		tournament = new Tournament(tourn_id, 'In Progress');
		await tournament.continueTournament();
	}
	else {
		tournament = new Tournament(tourn_id, 'Created');
		await tournament.launchTournament();
	}

	if (tournament.game_status === 'In Progress') {
		t_socket = new WebSocket(`ws://localhost:9000/ws/pong/${tourn_id}`);

		const canvas = displayGame();
		handleWebsocketTournament(t_socket, tournament, canvas, gameState);
		handleButtons(t_socket);

		let keysPressed = {}

		document.addEventListener("keydown", function (event) {
			keysPressed[event.key] = true;
			handleKeyPress(keysPressed, t_socket, gameState);
		});

		document.addEventListener("keyup", function (event) {
			keysPressed[event.key] = false;
			handleKeyPress(keysPressed, t_socket, gameState);
		});
	}
	else if (tournament.game_status === 'Finished') {
		urlRoute('/tournament');
		errormsg("Tournament already finished", "homepage-errormsg");
	}
}