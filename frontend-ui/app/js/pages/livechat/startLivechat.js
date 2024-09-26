import { userID } from "../user/updateProfile.js";
import { errormsg } from '../../dom/errormsg.js';
import { contact_blacklisted } from "./blacklist.js";
export var chatSocket

export async function startLivechat (conv_id, response) {
	chatSocket = new WebSocket(`wss://localhost:10443/ws/chat/${conv_id}`);

	const messageInput = document.getElementById("chat-textarea");
	const messageSubmitBtn = document.getElementById("chat-send");
	const chatArea = document.getElementById("chat-msgs");

	chatSocket.onopen = function () {
		console.log("LIVECHAT LOG: Websocket connection established");
	};

	// When receiving message from server
	chatSocket.onmessage = function(e) {
		const data = JSON.parse(e.data);

		if( data.blacklist == true) {
			errormsg("Could not send message, you are blacklisted", 'livechat-conversation-errormsg');
			return;
		}

		const userLookup = response.users.reduce((acc, user) => {
			acc[user.id] = {
				nickname: user.nickname,
				avatar: user.avatar
			};
			return acc;
		}, {});

		let id;
		if (response.users[0].id === data.author)
			id = response.users[0].id;
		else
			id = response.users[1].id;
		
		const messageElement = createMsgElement(id, userLookup, data.time, data.message);
		chatArea.appendChild(messageElement);
		chatArea.scrollTop = chatArea.scrollHeight;
	};

	chatSocket.onclose = function(e) {
		console.log('LIVECHAT LOG : Websocket connection closed');
	};

	// Message listeners
	messageSubmitBtn.addEventListener('click', function (event) {
		event.preventDefault();
		if (!response) {
			close(chatSocket);
			errormsg("Service Temporarily Unavailable", "livechat-conversation-errormsg");
		}
		else if ( chatSocket && chatSocket.readyState === 1) {
			if (contact_blacklisted == true) {
				console.error("USER LOG: ", "Contact is blacklisted");
				errormsg("You blacklisted that user", 'livechat-conversation-errormsg');
			} else {
				sendMessage(messageInput.value);
			}
		}
		else {
			errormsg("Service Temporarily Unavailable", "livechat-conversation-errormsg");
		}
		messageInput.value = '';	
	});	
}

function sendMessage(message) {
	if (message.trim()) {
		chatSocket.send(JSON.stringify({
			'author': userID,
			'message': message
		}));
	}
}

function createMsgElement(id, userLookup, time, message) {
	const messageElement = document.createElement("li");
	messageElement.classList.add("d-flex");
	messageElement.classList.add("mb-4");

	let avatar;
	if (id == userID) {
		avatar = localStorage.getItem('avatar');
		messageElement.classList.add("justify-content-end");
	} else {
		avatar = userLookup[id].avatar;
	}
	
	const newMessage = newChatMsg(avatar, time, message, id);
	messageElement.innerHTML = newMessage;

	return messageElement
}

function newChatMsg (avatar, time, msgText, id) {
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