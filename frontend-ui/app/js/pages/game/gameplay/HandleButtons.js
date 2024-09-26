import { errormsg } from "../../../dom/errormsg.js";

export default function handleButtons(socket) {
	const startButton = document.getElementById("start-button");
	const stopButton = document.getElementById("stop-button");
	const resetButton = document.getElementById("reset-button");

	if (startButton) {
		startButton.addEventListener("click", () => {
			console.log("GAME LOG: Start button clicked");
			
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ action: "start" }));
			} else { 
				errormsg("Service temporarily unavailable", 'homepage-errormsg');
			}
		});
	} else {
		console.error("GAME LOG: Start button not found");
	}

	if (stopButton) {
		stopButton.addEventListener("click", () => {
			console.log("GAME LOG: Stop button clicked");
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ action: "pause" }));
			} else { 
				errormsg("Service temporarily unavailable", 'homepage-errormsg');
			}
		});
	} else {
		console.error("GAME LOG: Stop button not found");
	}

	if (resetButton) {
		resetButton.addEventListener("click", () => {
			console.log("GAME LOG: Reset button clicked");
			socket.send(JSON.stringify({ action: "reset" }));
		});
	} else {
		console.error("GAME LOG: Reset button not found");
	}
}