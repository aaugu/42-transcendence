import { userID } from "../user/updateProfile.js";
import { errormsg } from '../../dom/errormsg.js';
import { contact_blacklisted } from "./blacklist.js";
export var chatSocket

export async function startLivechat (conv_id, response) {
	chatSocket = new WebSocket(`wss://localhost:10443/ws/chat/${conv_id}`);
	console.log(response);
	console.log("contact blacklist: ", contact_blacklisted);

	const messageSubmitBtn = document.getElementById("chat-send");
	const messageInput = document.getElementById("chat-textarea");

	chatSocket.onopen = function () {
		console.log(chatSocket);
		console.log("LIVECHAT LOG: Websocket connection established");
	};

	// Recevoir un message du serveur
	chatSocket.onmessage = function(e) {
		const data = JSON.parse(e.data);
		console.log("data: ", data);
		// console.log("data blacklisted: ", data['blacklisted']);
		// if( data.blacklisted ) {
		// 	errormsg("Could not send message, you are blacklisted", 'livechat-blacklist-errormsg');
		// 	return;
		// }

		const userLookup = response.users.reduce((acc, user) => {
			acc[user.id] = {
				nickname: user.nickname,
				avatar: user.avatar
			};
			return acc;
		}, {});

		const chatArea = document.getElementById("chat-msgs");

		let avatar, id;
		if (response.users[0].id === data.author) {
			id = response.users[0].id;
			
		} else {
			id = response.users[1].id;
		}
		
		const messageElement = document.createElement("li");
		messageElement.classList.add("d-flex");
		messageElement.classList.add("mb-4");

		if (id == userID) {
			avatar = localStorage.getItem('avatar');
			messageElement.classList.add("justify-content-end");
		} else {
			avatar = userLookup[id].avatar;
		}
		
		const newMessage = newChatMsg(avatar, data.time, data.message, id);
		messageElement.innerHTML = newMessage;
		chatArea.appendChild(messageElement);
		chatArea.scrollTop = chatArea.scrollHeight;
	};

	chatSocket.onclose = function(e) {
		console.log('Chat socket closed successfully');
	};

	// Message listeners
	messageSubmitBtn.addEventListener('click', function (event) {
		event.preventDefault();	
		sendMessage(messageInput.value);
		messageInput.value = '';	
	});	
}

function sendMessage(message) {
	if (contact_blacklisted == true) {
		console.error("USER LOG: ", "Contact is blacklisted");
		errormsg("You blacklisted that user", 'livechat-blacklist-errormsg');
		return;
	}

	if (message.trim()) {
		chatSocket.send(JSON.stringify({
			'author': userID,
			'message': message
		}));
	}
}

export function newChatMsg (avatar, time, msgText, id) {
    if (id === userID) {
        return `<div class="card">
        <div class="card-body">
            <p class="mb-0 small" style="font-size: 10px;">
            ${msgText}
            </p>
        </div>
        <div class="card-footer d-flex justify-content-end">
            <p class="small mb-0" style="font-size: 7px;">${time}</p>
        </div>
        </div>
        <img src=${avatar} alt="avatar"
        class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="30">`;
    }
    else {
        return `<img src=${avatar} alt="avatar"
        class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="30">
        <div class="card">
        <div class="card-body">
            <p class="mb-0 small" style="font-size: 10px;">
            ${msgText}
            </p>
        </div>
        <div class="card-footer d-flex justify-content-end">
            <p class="small mb-0" style="font-size: 7px;">${time}</p>
        </div>
        </div>`;
    }

}