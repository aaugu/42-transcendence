export default function createWebSocketConnection() {
  const socket = new WebSocket("wss://" + 'localhost:9000' + "/ws/pong/");

  socket.onopen = function () {
    console.log("Websocket connection established");
  };

  return socket;
}
