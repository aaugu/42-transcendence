import { userID } from "../user/updateProfile.js";
import { errormsg } from '../../dom/errormsg.js';
import { contact_blacklisted } from "./blacklist.js";
import { newMsg } from "./messages.js";
import { escapteHTML } from '../../dom/preventXSS.js';
export var chatSocket

export async function startLivechat (conv_id, response) {
	chatSocket = new WebSocket('wss://' + window.location.host + `/ws/chat/${conv_id}`);

	const messageInput = document.getElementById("chat-textarea");
	const messageSubmitBtn = document.getElementById("chat-send");
	var chatArea = document.getElementById("chat-msgs");

	chatSocket.onopen = function (e) {};

	chatSocket.onclose = function(e) {
		if (e.code === 3000) {
			errormsg("Unauthorized access. Please log in.", "homepage-errormsg");
		} else if (e.code === 4000) {
			errormsg("Bad request or service unavailable", "homepage-errormsg");
		} else if (e.code === 4004) {
			errormsg("Conversation does not exist", "homepage-errormsg");
		}
	};

	chatSocket.onerror = function(e) {};

	chatSocket.onmessage = function(e) {
		try {
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
			chatArea.innerHTML += messageElement;
			chatArea.scrollTop = chatArea.scrollHeight;
		} catch (error) {
			errormsg("Could not send message", "livechat-conversation-errormsg");
		}
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
			'message': escapteHTML(message)
		}));
	}
}

function createMsgElement(id, userLookup, time, message) {
	let avatar;
	if (id == userID) {
		avatar = localStorage.getItem('avatar');
	} else {
		avatar = userLookup[id].avatar;
	}

	const newMessage = newMsg(avatar, time, message, id);

	return newMessage
}
