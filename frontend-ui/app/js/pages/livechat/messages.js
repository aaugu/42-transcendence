import { userID } from '../user/updateProfile.js';

//placement values: right, left
function newMsg (avatar, time, msgText, placement) {
    if (placement === "right") {
        return `<li class="d-flex mb-4 justify-content-end">
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
        return `<li class="d-flex mb-4">
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

export function displayMessages(conversation) {
    if (conversation === null || conversation === undefined) {
        throw new Error('Messages cannot be displayed');
    }
    const userLookup = conversation.users.reduce((acc, user) => {
        acc[user.id] = {
            nickname: user.nickname,
            avatar: user.avatar
        };
        return acc;
    }, {});

    var ul_convo = document.getElementById('chat-msgs');
    ul_convo.innerHTML = '';

    var html_convo = '';

    if (conversation.messages) {
        conversation.messages.forEach(message => {
            let avatar, placement;
            if (message.author === userID) {
                avatar = localStorage.getItem('avatar');
                placement = 'right';
            } else {
                avatar = userLookup[message.author].avatar;
                placement = 'left';
            }
            html_convo += newMsg(avatar, message.time, message.message, placement);
        });
    }
    ul_convo.innerHTML = html_convo;

    const chatContainer = document.getElementById('chat-msgs');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

export function displayChatInterface () {
    const welcomeMessages = document.getElementById('chat-welcome');
    welcomeMessages.innerHTML = '';

    document.getElementById('chat-div-textarea').classList.remove('hidden');
    document.getElementById('chat-send').classList.remove('hidden');
}


/* template for messages:

LEFT ALIGNED:
<li class="d-flex mb-4">
	<img src=${defaultAvatar} alt="avatar"
	class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="30">
	<div class="card">
	<div class="card-body">
		<p class="mb-0">
		Hi there 👋
		</p>
	</div>
	<div class="card-footer d-flex justify-content-end">
		<p class="small mb-0" style="font-size: 7px;">19:25</p>
	</div>
	</div>
</li>

RIGHT ALIGNED:
<li class="d-flex mb-4 justify-content-end">
	<div class="card">
		<div class="card-body">
			<p class="mb-0">
			huhu
			</p>
		</div>
		<div class="card-footer d-flex justify-content-end">
			<p class="small mb-0" style="font-size: 7px;">19:25</p>
		</div>
	</div>
	<img src=${defaultAvatar} alt="avatar"
	class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="30">
</li>

*/