export default function createWebSocketConnection() {
  // const socket = new WebSocket("ws://" + window.location.host + "/ws/pong/");

  const socket = new WebSocket("ws://localhost:9000/ws/pong/");


  socket.onopen = function () {
    console.log("GAME LOG: Websocket connection established");
  };

  return socket;
}
