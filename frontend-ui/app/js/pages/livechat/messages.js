import { userID } from '../user/updateProfile.js';

//placement values: right, left
function newMsg (avatar, time, msgText, placement) {
    if (placement === "right") {
        return `<li class="d-flex mb-4 justify-content-end">
        <div class="card">
        <div class="card-body">
            <p class="mb-0 small">
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
            <p class="mb-0 small">
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

export function displayMessages (response) {
    if (response === null || response === undefined)
        throw new Error('Messages cannot be displayed');

    const userLookup = response.users.reduce((acc, user) => {
        acc[user.id] = {
            nickname: user.nickname,
            avatar: user.avatar
        };
        return acc;
    }, {});

    var div_convo = document.getElementById('conversation');
    div_convo.innerHTML = '';

    var html_convo = `<ul class="row list-unstyled custom-scrollbar text-white
                        w-100 mb-2" style="max-height: 500px; min-height: 300px;">`;

    response.messages.forEach(message => {
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

    html_convo += `</ul>
                    <div class="d-flex align-items-center">
                            <div class="flex-grow-1 me-2">
                                <div data-mdb-input-init class="form-outline form-white">
                                    <textarea class="form-control" id="textAreaExample3"></textarea>
                                    <label class="form-label" for="textAreaExample3"></label>
                                </div>
                            </div>
                            <button type="button" class="btn btn-light btn-sm btn-rounded">Send</button>
                        </div>`;
    div_convo.innerHTML = html_convo;
    //scroll to bottom
    const chatContainer = document.querySelector('.custom-scrollbar');
    chatContainer.scrollTop = chatContainer.scrollHeight;
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