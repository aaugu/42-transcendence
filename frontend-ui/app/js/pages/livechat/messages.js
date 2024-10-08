import { userID } from '../user/updateProfile.js';
import { colorBlockButton } from './blacklist.js';
import { setCurrentContactID } from './notifications.js';

export function newMsg (avatar, time, text, id) {
    if (id === userID) {
        return `<li data-msgid="${id}" class="d-flex mb-4 justify-content-end">
        <div class="card">
        <div class="card-body">
            <p class="mb-0 small w-100" style="font-size: 10px;">
            ${text}
            </p>
        </div>
        <div class="card-footer d-flex justify-content-end">
            <p class="small mb-0" style="font-size: 7px;">${time}</p>
        </div>
        </div>
        <img src=${avatar} alt="avatar"
        class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="20">
    </li>`;
    }
    else {
        return `<li data-msgid="${id}" class="d-flex mb-4">
        <img src=${avatar} alt="avatar"
        class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="20">
        <div class="card">
        <div class="card-body">
            <p class="mb-0 small w-100" style="font-size: 10px;">
            ${text}
            </p>
        </div>
        <div class="card-footer d-flex justify-content-end">
            <p class="small mb-0" style="font-size: 7px;">${time}</p>
        </div>
        </div>
    </li>`;
    }

}

export function displayMessages(response, notifications) {
    if (response === null || response === undefined) {
        throw new Error('Messages cannot be displayed');
    }
    const userLookup = response.users.reduce((acc, user) => {
        acc[user.id] = {
            nickname: user.nickname,
            avatar: user.avatar
        };
        return acc;
    }, {});

    var ul_convo = document.getElementById('chat-msgs');
	if (!ul_convo)
		return ;
    ul_convo.innerHTML = '';

    var html_convo = '';

    if (response.messages) {
        response.messages.forEach(message => {
            let avatar, id;
            if (message.author === userID) {
                avatar = localStorage.getItem('avatar');
                id = userID;
            } else {
                avatar = userLookup[message.author].avatar;
                id = message.author;
            }
            html_convo += newMsg(avatar, message.time, message.message, id);
        });
    }
    ul_convo.innerHTML = html_convo;

    const chatContainer = document.getElementById('chat-msgs');
    if (!notifications)
        chatContainer.scrollTop = chatContainer.scrollHeight;
}

export function displayChatInterface (ctc_id, ctc_nickname) {
    const welcomeMessages = document.getElementById('chat-welcome');
	const chatTextarea = document.getElementById('chat-div-textarea');
	const chatSend = document.getElementById('chat-send');
	const play_button_local = document.getElementById('chat-invite-game-local');
    const play_button = document.getElementById('chat-invite-game');
    const block_button = document.getElementById('chat-block-btn');
    const nickname = document.getElementById('ctc-nickname');

	if (!welcomeMessages || !chatTextarea || !chatSend || !play_button || !block_button || !nickname)
		return ;

    welcomeMessages.innerHTML = '';
    chatTextarea.classList.remove('hidden');
    chatSend.classList.remove('hidden');
    play_button_local.classList.remove("hidden");
    play_button.classList.remove('hidden');
    block_button.classList.remove('hidden');
    colorBlockButton();
    block_button.setAttribute('data-ctcid', ctc_id);
    play_button.setAttribute('data-ctcid', ctc_id);
    play_button_local.setAttribute('data-ctcid', ctc_id);
    if (ctc_nickname !== "Notifications") {
        nickname.classList.remove('hidden');
        nickname.setAttribute('data-otherctcid', ctc_id);
        nickname.innerText = ctc_nickname;
    }

    if (parseInt(ctc_id) === userID) {
        document.getElementById('chat-div-textarea').classList.add('hidden');
        document.getElementById('chat-send').classList.add('hidden');
        document.getElementById('chat-invite-game').classList.add('hidden');
        document.getElementById('chat-invite-game-local').classList.add('hidden');
        document.getElementById('chat-block-btn').classList.add('hidden');
        document.getElementById('ctc-nickname').classList.add('hidden');
    }
    setCurrentContactID(ctc_id);
}
