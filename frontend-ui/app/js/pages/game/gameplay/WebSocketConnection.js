export default function createWebSocketConnection() {
  // const socket = new WebSocket("ws://" + window.location.host + "/ws/pong/");

  function generateUniqueId() {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, function () {
      const r = (Math.random() * 16) | 0;
      return r.toString(16);
    });
  }
  
  // Generate a unique ID
  const gameId = generateUniqueId();

  console.log("Game ID: ", gameId);

  const socket = new WebSocket(`ws://localhost:9000/ws/pong/${gameId}`);

  const currentUrl = window.location.href;
  window.location.href = `${currentUrl}/${gameId}`;

  socket.onopen = function () {
    console.log("Websocket connection established");
  };

  return socket;
}
