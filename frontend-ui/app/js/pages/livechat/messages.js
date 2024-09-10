import { userID } from '../user/updateProfile.js';
import { colorBlockButton } from './blacklist.js';

//placement values: right, left
function newMsg (avatar, time, msgText, id) {
    if (id === userID) {
        return `<li data-msgid="${id}" class="d-flex mb-4 justify-content-end">
        <div class="card">
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
        class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="30">
    </li>`;
    }
    else {
        return `<li data-msgid="${id}" class="d-flex mb-4">
        <img src=${avatar} alt="avatar"
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
        </div>
    </li>`;
    }

}

export function displayMessages(response) {
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
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

export function displayChatInterface (ctc_id) {
    const welcomeMessages = document.getElementById('chat-welcome');
    welcomeMessages.innerHTML = '';

    document.getElementById('chat-div-textarea').classList.remove('hidden');
    document.getElementById('chat-send').classList.remove('hidden');
    document.getElementById('chat-play-pong').classList.remove('hidden');
    const block_button = document.getElementById('chat-block-btn');
    block_button.classList.remove('hidden');
    colorBlockButton();
    block_button.setAttribute('data-ctcid', ctc_id);
}

export function undisplayChatInterface() {
    // const welcomeMessages = document.getElementById('chat-welcome');
    // welcomeMessages.innerHTML = `<div class="h6 text-center">${msg}</div>`;
    document.getElementById('chat-div-textarea').classList.add('hidden');
    document.getElementById('chat-send').classList.add('hidden');
    document.getElementById('chat-play-pong').classList.add('hidden');
    document.getElementById('chat-block-btn').classList.add('hidden');
}
