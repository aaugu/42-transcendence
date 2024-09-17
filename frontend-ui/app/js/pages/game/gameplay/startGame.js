import createWebSocketConnection from './WebSocketConnection.js'
import handleButtons from './HandleButtons.js';
import handleKeyPress from './HandleKeyPress.js';
import updateGameState from './GameDraw.js';
import throttle from './Throttle.js';
import { canvasWidth, canvasHeight } from './GameConstants.js';
import { displayGame } from './displayGame.js';
import { handleWebsocketGame } from './handleWebsocket.js';
import { urlRoute } from '../../../dom/router.js';
import { errormsg } from '../../../dom/errormsg.js';

export var g_socket;

export async function startGame() {
	const gameId = window.location.href.split("/")[4];
	console.log("game Id: ", gameId);
  	let gameState = { current: null };

	g_socket = new WebSocket(`ws://localhost:9000/ws/pong/${gameId}`);
	if (g_socket.readyState !== WebSocket.OPEN) {
		urlRoute('/tournament-creation');
		errormsg('Connection to game could not be established', "homepage-errormsg");
		return ;
	}
	const canvas = displayGame();
	handleWebsocketGame(g_socket, canvas, gameState);
	handleButtons(g_socket);

	let keysPressed = {};
	document.addEventListener("keydown", function (event) {
	  keysPressed[event.key] = true;
	  handleKeyPress(keysPressed, g_socket, gameState);
	});

	document.addEventListener("keyup", function (event) {
	  keysPressed[event.key] = false;
	  handleKeyPress(keysPressed, g_socket, gameState);
	});
}
