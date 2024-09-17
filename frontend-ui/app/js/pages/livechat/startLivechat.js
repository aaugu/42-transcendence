import { userID } from "../user/updateProfile.js";
export var chatSocket

export async function startLivechat (conv_id, response) {
    chatSocket = new WebSocket(`wss://localhost:10443/ws/chat/${conv_id}`);
    const messageSubmitBtn = document.getElementById("chat-send");
    const messageInput = document.getElementById("chat-textarea");

    chatSocket.onopen = function () {
        console.log(chatSocket);
        console.log("LIVECHAT LOG: Websocket connection established");
    };

    // Recevoir un message du serveur
    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log("on message: ", data.message);
        const chatArea = document.getElementById("chat-msgs");  // Assure-toi que cet ID correspond à la zone de discussion
        const messageElement = document.createElement("div");
        messageElement.textContent = `${data.author}: ${data.message}`;
        chatArea.appendChild(messageElement);
    };

    chatSocket.onclose = function(e) {
        console.log('Chat socket closed successfully');
    };

    // Message listener
    messageSubmitBtn.addEventListener("click", function (event) {
        event.preventDefault();
    
        const messageContent = messageInput.value;

        if (messageContent.trim()) {
            chatSocket.send(JSON.stringify({
                'author': userID,
                'message': messageContent
            }));
    
            messageInput.value = '';
        }
    });
}