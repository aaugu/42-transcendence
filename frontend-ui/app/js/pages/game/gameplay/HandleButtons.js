import { errormsg } from "../../../dom/errormsg.js";

export default function handleButtons(socket) {
	const startButton = document.getElementById("start-button");
	const stopButton = document.getElementById("stop-button");
	// const resetButton = document.getElementById("reset-button");

	if (startButton) {
		startButton.addEventListener("click", () => {
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ action: "start" }));
			} else {
				errormsg("Service temporarily unavailable", 'homepage-errormsg');
			}
		});
	}

	if (stopButton) {
		stopButton.addEventListener("click", () => {
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ action: "pause" }));
			} else {
				errormsg("Service temporarily unavailable", 'homepage-errormsg');
			}
		});
	}
}