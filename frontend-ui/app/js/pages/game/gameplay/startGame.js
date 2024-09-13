import createWebSocketConnection from './WebSocketConnection.js'
import handleButtons from './HandleButtons.js';
import handleKeyPress from './HandleKeyPress.js';
import updateGameState from './GameDraw.js';
import throttle from './Throttle.js';
import { canvasWidth, canvasHeight } from './GameConstants.js';
import { displayGame } from './displayGame.js';

export var socket;

export async function startGame(event) {
	// const canvas = document.getElementById("pongCanvas");
	// const infoCtn = document.querySelector(".info-ctn");
	socket = await createWebSocketConnection();

  displayGame(socket);
	// start = true
}