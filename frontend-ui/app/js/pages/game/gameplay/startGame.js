import createWebSocketConnection from './WebSocketConnection.js'
import handleButtons from './HandleButtons.js';
import handleKeyPress from './HandleKeyPress.js';
import updateGameState from './GameDraw.js';
import throttle from './Throttle.js';
import { canvasWidth, canvasHeight } from './GameConstants.js';
import { displayGame } from './displayGame.js';
import { handleWebsocketGame } from './handleWebsocket.js';

export var g_socket;

export async function startGame() {
	document.getElementById('tournament-table').classList.add('hidden');
	const gameId = window.location.href.split("/")[4];
  	let gameState = { current: null };

	g_socket = new WebSocket(`wss://localhost:10443/wsn/pong/${gameId}`);

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
