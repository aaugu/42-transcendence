export var chatSocket

export async function startLivechat (conv_id) {
    console.log("ici");
    chatSocket = new WebSocket(`ws://localhost:8000/ws/chat/${conv_id}`);
    console.log(chatSocket.readyState);
    chatSocket.onopen = function () {
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
    const messageSubmitBtn = document.getElementById("chat-send");
    messageSubmitBtn.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("chat send")
    });
}