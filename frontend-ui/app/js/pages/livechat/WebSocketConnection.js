export default function createWebSocketConnection(id) {
 
    const socket = new WebSocket(`ws://172.20.5.2:8000/ws/livechat/conversation/${id}/`);

    socket.onopen = function () {
      console.log("LIVECHAT LOG: Websocket connection established");
    };
  
    return socket;
  }