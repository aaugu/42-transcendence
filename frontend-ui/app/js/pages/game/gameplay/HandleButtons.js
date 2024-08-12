export default function handleButtons(startButton, stopButton, resetButton, socket) {
  if (startButton) {
    startButton.addEventListener("click", () => {
      console.log("Start button clicked");
      socket.send(JSON.stringify({ action: "start" }));
    });
  } else {
    console.error("Start button not found");
  }

  if (stopButton) {
    stopButton.addEventListener("click", () => {
      console.log("Stop button clicked");
      socket.send(JSON.stringify({ action: "pause" }));
    });
  } else {
    console.error("Stop button not found");
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      console.log("Reset button clicked");
      socket.send(JSON.stringify({ action: "reset" }));
    });
  } else {
    console.error("Reset button not found");
  }
}