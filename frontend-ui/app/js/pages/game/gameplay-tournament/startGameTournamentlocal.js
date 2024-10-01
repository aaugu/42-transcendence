import handleButtons from '../gameplay/HandleButtons.js';
import handleKeyPress from '../gameplay/HandleKeyPress.js';
import { Tournament } from './tournamentClass.js';
import { displayGame } from '../gameplay/displayGame.js';
import { handleWebsocketTournament } from '../gameplay/handleWebsocket.js';
import { getTournamentDetails } from '../../tournament/getTournaments.js';
import { urlRoute } from '../../../dom/router.js';
import { errormsg } from '../../../dom/errormsg.js';

export var t_socket;

export async function startGameTournamentlocal() {
	let tournament;
	let gameState = { current: null };
	let t_details;

	document.getElementById('tournament-table').classList.remove('hidden');
	const tourn_id = localStorage.getItem('tourn_id');
	localStorage.removeItem('tourn_id');
	const gameId = window.location.href.split("/")[4];

	try {
		if (!tourn_id || !gameId)
			throw new Error("Tournament not found");

		t_details = await getTournamentDetails(tourn_id);
		if (t_details.status === 'In Progress') {
			tournament = new Tournament(tourn_id, 'In Progress');
			await tournament.continueTournament();
		}
		else if (t_details.status === 'Created')
			throw new Error("This tournament is not in progress");
		else if (t_details.status === 'Finished')
			throw new Error("This tournament is already finished");
	} catch (e) {
		urlRoute('/tournament-creation');
		errormsg(e.message, "homepage-errormsg");
		return;
	}

	t_socket = new WebSocket('wss://' + window.location.host + `/wsn/pong/${gameId}`);

	const canvas = displayGame();
	handleWebsocketTournament(t_socket, tournament, canvas, gameState);
	handleButtons(t_socket);

	document.addEventListener("keydown", keyDownEventTournamentLocal);
	document.addEventListener("keyup", keyUpEventTournamentLocal);
}

export function keyDownEventTournamentLocal(event) {
	let keysPressed = {};
	keysPressed[event.key] = true;
	handleKeyPress(keysPressed, t_remote_socket, gameState);
}

export function keyUpEventTournamentLocal(event) {
	let keysPressed = {};
	keysPressed[event.key] = false;
	handleKeyPress(keysPressed, t_remote_socket, gameState);
}