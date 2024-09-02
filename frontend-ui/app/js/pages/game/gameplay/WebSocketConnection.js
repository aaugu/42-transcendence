export default function createWebSocketConnection() {
  // const socket = new WebSocket("ws://" + window.location.host + "/ws/pong/");

  // Generate a unique ID
  const currentUrl = window.location.href;
  console.log("Current URL: ", currentUrl);

  const mode = currentUrl.split("/")[3];
  console.log("Mode: ", mode);

  const gameId = generateUniqueId(mode);
  console.log("Game ID: ", gameId);

  const socket = new WebSocket(`ws://localhost:9000/ws/pong/${gameId}`);

  socket.onopen = function () {
    console.log("Websocket connection established");
  };

  return socket;
}
