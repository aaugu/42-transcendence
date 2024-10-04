import { userID } from "../user/updateProfile.js";
import { errormsg } from '../../dom/errormsg.js';
import { contact_blacklisted } from "./blacklist.js";
import { newMsg } from "./messages.js";
export var chatSocket

export async function startLivechat (conv_id, response) {
	chatSocket = new WebSocket('wss://' + window.location.host + `/ws/chat/${conv_id}`);

	const messageInput = document.getElementById("chat-textarea");
	const messageSubmitBtn = document.getElementById("chat-send");
	const chatArea = document.getElementById("chat-msgs");

	chatSocket.onopen = function () {};

	// When receiving message from server
	chatSocket.onmessage = function(e) {
		const data = JSON.parse(e.data);

		if( data.blacklist == true) {
			errormsg("Could not send message", 'livechat-conversation-errormsg');
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

	chatSocket.onclose = function(e) {};

	const onSend = () => {
		if (!response) {
			close(chatSocket);
			errormsg("Service Temporarily Unavailable", "livechat-conversation-errormsg");
		}
		else if ( chatSocket && chatSocket.readyState === 1) {
			if (contact_blacklisted == true) {
				errormsg("You blacklisted that user", 'livechat-conversation-errormsg');
			} else {
				sendMessage(messageInput.value);
			}
		}
		else {
			errormsg("Service Temporarily Unavailable", "livechat-conversation-errormsg");
		}
		messageInput.value = '';
	}

	// Message listeners
	messageSubmitBtn.addEventListener('click', onSend);
	messageInput.addEventListener('keydown', function(event) {
		if (event.key === 'Enter' && event.shiftKey)
			return;
		else if (event.key === 'Enter') {
			event.preventDefault();
			onSend();
		}
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

	const newMessage = newMsg(avatar, time, message, id);
	messageElement.innerHTML = newMessage;

	return messageElement
}
