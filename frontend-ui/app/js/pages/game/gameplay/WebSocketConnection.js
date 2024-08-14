export default function createWebSocketConnection() {
  const socket = new WebSocket("wss://" + 'localhost:10444' + "/ws/pong/");

  socket.onopen = function () {
    console.log("Websocket connection established");
  };

  return socket;
}
