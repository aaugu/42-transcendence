export var chatSocket

export async function startLivechat (conv_id) {
    // chatSocket = new WebSocket(`wss://localhost:10443/ws/chat/${conv_id}`);
    chatSocket = new WebSocket(`wss://localhost:10443/ws/chat/`);
    console.log(chatSocket);

    chatSocket.onopen = function () {
        console.log(chatSocket);
        console.log("LIVECHAT LOG: Websocket connection established");
    };
    // Recevoir un message du serveur
    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log(data, data.message);
    };

    // chatSocket.onopen = function(e) {
    //     chatSocket.send(JSON.stringify({
    //         'message': 'Bonjour à tous dans la conversation !'
    //     }));
    // };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

    // Message listener
    // const messageSubmitBtn = document.getElementById("chat-send");
    // messageSubmitBtn.addEventListener("click", function (event) {
    //     event.preventDefault();
    //     console.log("chat send")
    // });
}