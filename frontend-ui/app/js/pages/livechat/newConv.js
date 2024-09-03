import { userID } from '../user/updateProfile.js';
import { newMsg } from './newMsg.js';

async function newConv(conv_nickname) {
    if (conv_nickname === null || conv_nickname === undefined || userID === null ) {
		throw new Error('Did not find userID or nickname invalid');
	}

	const response = await fetch('https://localhost:10444/livechat/' + userID + '/conversations/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"nickname": conv_nickname
		}),
		credentials: 'include'
	});
	if (!response.ok) {
		if (response.errors)
			throw new Error(`${response.errors}`);
		throw new Error(`${response.status}`);
	}
	const responseData = await response.json();
	if (responseData !== null) {
		console.log(`USER LOG: ${responseData.message}`);
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}

export async function newConvButton(e) {
	e.preventDefault();
	const conv_nickname = document.getElementById('chat-search-input').value;
	try {
		const response = await newConv(conv_nickname);
		// console.log(response);

		var div_convo = document.getElementById('conversation');
		div_convo.innerHTML = '';

		var html_convo = `<ul class="row list-unstyled custom-scrollbar text-white
							w-100 mb-2" style="max-height: 500px; min-height: 300px;">`;

		//add all messages here
		// html_convo += newMsg('https://localhost:10444/img/avatar.png', '19:25', 'Hi there 👋', '');

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
	} catch (e) {
		console.error(`USER LOG: ${e.message}`);
	}
	finally {
        document.getElementById('chat-search-input').value = '';
    }
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