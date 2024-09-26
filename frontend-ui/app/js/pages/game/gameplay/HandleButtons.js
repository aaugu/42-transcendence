export default function handleButtons(socket) {
  const startButton = document.getElementById("start-button");
	const stopButton = document.getElementById("stop-button");
	const resetButton = document.getElementById("reset-button");

  if (startButton) {
    startButton.addEventListener("click", () => {
      console.log("GAME LOG: Start button clicked");
      socket.send(JSON.stringify({ action: "start" }));
    });
  } else {
    console.error("GAME LOG: Start button not found");
  }

  if (stopButton) {
    stopButton.addEventListener("click", () => {
      console.log("GAME LOG: Stop button clicked");
      socket.send(JSON.stringify({ action: "pause" }));
    });
  } else {
    console.error("GAME LOG: Stop button not found");
  }
}