import createWebSocketConnection from './WebSocketConnection.js'



export async function startLivechat (event) {
    // Create socket connection
    socket = createWebSocketConnection();
    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data.game_state) {
            updateLivechat(data.game_state);
        }
    };

    // Message listener
    const messageSubmitBtn = document.getElementById("message-submit-btn");
    messageSubmitBtn.addEventListener("click", function (event) {
        sendMessage(socket);
    });
}