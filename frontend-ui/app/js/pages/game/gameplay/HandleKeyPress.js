import { controllerRightUp, controllerRightDown, controllerLeftUp, controllerLeftDown } from "./GameConstants.js";
import { userID } from "../../user/updateProfile.js";

export default function handleKeyPress(keysPressed, socket, gameState) {
	if (socket && socket.readyState !== WebSocket.OPEN)
		return;

	const gameMode = window.location.pathname.split("/")[1];
	const isRemoteGame =
	gameMode === "remote-twoplayer" || gameMode === "join-game" || gameMode === "tournament-remote";

	const keyActionMap = {
	[controllerLeftUp]: { direction_left_paddle: "up" },
	[controllerLeftDown]: { direction_left_paddle: "down" },
	[controllerRightUp]: { direction_right_paddle: "up" },
	[controllerRightDown]: { direction_right_paddle: "down" },
	};

	if (isRemoteGame) {
		let playerIndex = null;

		if (userID == gameState.current.paddles[0].player_id) {
			playerIndex = 0;
		} else if (userID == gameState.current.paddles[1].player_id) {
			playerIndex = 1;
		}

		if (playerIndex != null) {
			const controller =
			playerIndex === 0
				? [controllerLeftUp, controllerLeftDown]
				: [controllerRightUp, controllerRightDown];

			for (const key of controller) {
				if (keysPressed[key]) {
					socket.send(JSON.stringify(keyActionMap[key]));
					return;
				}
			}
		}
	} else {
		for (const key in keyActionMap) {
			if (keysPressed[key]) {
				socket.send(JSON.stringify(keyActionMap[key]));
			}
		}
	}
}