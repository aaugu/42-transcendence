import createWebSocketConnection from '../gameplay/WebSocketConnection.js'
import handleButtons from '../gameplay/HandleButtons.js';
import handleKeyPress from '../gameplay/HandleKeyPress.js';
import updateGameState from '../gameplay/GameDraw.js';
import throttle from '../gameplay/Throttle.js';
import { canvasWidth, canvasHeight } from '../gameplay/GameConstants.js';
import { Tournament } from './tournamentClass.js';
import { displayGame } from '../gameplay/displayGame.js';
import { handleWebsocketTournament } from '../gameplay/handleWebsocket.js';

export var socket;

export async function startGameTournament() {
	const tourn_id = localStorage.getItem('tourn_id');
    localStorage.removeItem('tourn_id');

	const tournament = new Tournament(tourn_id);
	await tournament.launchTournament();

	socket = await createWebSocketConnection();
	if (!socket)
		return; //error handling if game id cannot be created

	console.log("FUNCTION START TOURNAMENT GAME");

	displayGame();

	//socket events
	handleWebsocketTournament(socket, tournament);


	handleButtons(socket);

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