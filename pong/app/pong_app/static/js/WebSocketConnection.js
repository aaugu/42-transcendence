export default function createWebSocketConnection() {
  const socket = new WebSocket("ws://" + window.location.host + "/ws/pong/");

  socket.onopen = function () {
    console.log("Websocket connection established");
  };

  return socket;
}
