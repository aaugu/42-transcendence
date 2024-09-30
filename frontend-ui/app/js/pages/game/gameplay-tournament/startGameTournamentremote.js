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


export async function startGameTournamentremote() {
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
			tournament = new RemoteTournament(tourn_id, 'In Progress');
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

  t_remote_socket = new WebSocket(`wss://localhost:10443/wsn/pong/${gameId}?user_id=${userID}`);

	const canvas = displayGame();
	handleWebsocketTournament_remote(t_remote_socket, tournament, canvas, gameState);
	handleButtons(t_remote_socket);

	let keysPressed = {}

	document.addEventListener("keydown", function (event) {
		keysPressed[event.key] = true;
		handleKeyPress(keysPressed, t_remote_socket, gameState);
	});

	document.addEventListener("keyup", function (event) {
		keysPressed[event.key] = false;
		handleKeyPress(keysPressed, t_remote_socket, gameState);
	});
}