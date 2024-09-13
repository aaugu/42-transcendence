export default function handleButtons(startButton, stopButton, resetButton, socket) {

  console.log("handle buttons")

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

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      console.log("GAME LOG: Reset button clicked");
      socket.send(JSON.stringify({ action: "reset" }));
    });
  } else {
    console.error("GAME LOG: Reset button not found");
  }
}