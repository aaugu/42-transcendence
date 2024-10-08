import handleButtons from '../gameplay/HandleButtons.js';
import handleKeyPress from '../gameplay/HandleKeyPress.js';
import { RemoteTournament } from './tournamentClass.js';
import { displayGame } from '../gameplay/displayGame.js';
import { handleWebsocketTournament_remote } from '../gameplay/handleWebsocket.js';
import { getTournamentDetails } from '../../tournament/getTournaments.js';
import { urlRoute } from '../../../dom/router.js';
import { errormsg } from '../../../dom/errormsg.js';
import { userID } from '../../user/updateProfile.js';

export var t_remote_socket;
let gameState = { current: null };


export async function startGameTournamentremote() {
	let tournament;
	let t_details;

	document.getElementById('tournament-table').classList.remove('hidden');
	const tourn_id = localStorage.getItem('tourn_id');
	localStorage.removeItem('tourn_id');
	const gameId = window.location.href.split("/")[4];

	try {
		if (!tourn_id || !gameId)
			throw new Error("Tournament was interrupted due to an error");

		t_details = await getTournamentDetails(tourn_id);
		if (t_details.status === 'In Progress') {
			tournament = new RemoteTournament(tourn_id, 'In Progress');
			await tournament.continueTournament();
		}
		else if (t_details.status === 'Created')
			throw new Error("This tournament is not in progress");
		else if (t_details.status === 'Finished')
			throw new Error("This tournament is already finished");

		t_remote_socket = new WebSocket('wss://' + window.location.host + `/ws/pong/${gameId}?user_id=${userID}`);

		const canvas = displayGame();
		handleWebsocketTournament_remote(t_remote_socket, tournament, canvas, gameState);
		handleButtons(t_remote_socket);

		document.addEventListener("keydown", keyDownEventTournamentRemote);
		document.addEventListener("keyup", keyUpEventTournamentRemote);
	} catch (e) {
		if (e.message === "500" || e.message === "502") {
			urlRoute('/profile')
			errormsg("Service temporarily unavailable", "homepage-errormsg");
		} else {
			urlRoute('/tournament-creation');
			errormsg(e.message, "homepage-errormsg");
		}
	}
}

export function keyDownEventTournamentRemote(event) {
	let keysPressed = {};
	keysPressed[event.key] = true;
	handleKeyPress(keysPressed, t_remote_socket, gameState);
}

export function keyUpEventTournamentRemote(event) {
	let keysPressed = {};
	keysPressed[event.key] = false;
	handleKeyPress(keysPressed, t_remote_socket, gameState);
}