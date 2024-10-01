import createWebSocketConnection from './WebSocketConnection.js'
import handleButtons from './HandleButtons.js';
import handleKeyPress from './HandleKeyPress.js';
import updateGameState from './GameDraw.js';
import throttle from './Throttle.js';
import { canvasWidth, canvasHeight } from './GameConstants.js';
import { displayGame } from './displayGame.js';
import { handleWebsocketGame } from './handleWebsocket.js';
import { errormsg } from "../../../dom/errormsg.js";
import { urlRoute } from "../../../dom/router.js";
import { error500 } from '../../errorpage/error500.js';
import { error404Page } from '../../errorpage/error404Page.js';

export var g_socket;

export async function startGame() {
	document.getElementById('tournament-table').classList.add('hidden');
	const gameId = window.location.href.split("/")[4];
	if (!gameId) {
		document.getElementById("main-content").innerHTML = error404Page();
		return ;
	}

  	let gameState = { current: null };
	  const right_player = localStorage.getItem('right');
	  const left_player = localStorage.getItem('left');

	g_socket = new WebSocket('wss://' + window.location.host + `/wsn/pong/${gameId}`);
	if (!g_socket) {
		document.getElementById("main-content").innerHTML = error500();
		return ;
	}

	const canvas = displayGame();
	if (right_player && left_player) {
		document.getElementById('player1').innerText = left_player;
		document.getElementById('player2').innerText = right_player;
	}
	localStorage.removeItem('right');
	localStorage.removeItem('left');

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
