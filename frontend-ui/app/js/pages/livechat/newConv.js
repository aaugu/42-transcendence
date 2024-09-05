import { displayChatInterface } from './messages.js';
import { userID } from '../user/updateProfile.js';

async function newConv(conv_nickname) {
    if (conv_nickname === null || conv_nickname === undefined || userID === null ) {
		throw new Error('USER LOG: Did not find userID or nickname invalid');
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
	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error(`${response.status}`);
	}
	if (responseData !== null) {
		console.log('USER LOG: FETCH NEW CONV SUCCESSFUL');
		return responseData;
	} else {
		throw new Error('USER LOG: No response from server');
	}
}

export async function newConvButton(e) {
	const conv_nickname = document.getElementById('chat-search-input').value;
	try {
		const response = await newConv(conv_nickname);
		// console.log("response newConvButton: ", response);
		displayChatInterface();

		const conv_id = response.conversation_id;
		const contact_list = document.getElementById('chat-contact-list');
		const new_list_item = document.createElement('li');
		new_list_item.classList.add('list-group-item');
		// new_list_item.style.backgroundColor = '#A9C1FF';
		new_list_item.innerHTML = `<span data-convid="${conv_id}">${conv_nickname}</span>
									<button id="block-btn" class="btn btn-outline-danger btn-sm m-0 p-1" title="Block user" type="button" data-nickname="${conv_nickname}">
                    					<i class="bi text-danger bi-ban m-0 p-0"></i>
									</button>`;
		contact_list.appendChild(new_list_item);

	} catch (e) {
		console.error(`USER LOG: ${e.message}`);
	}
	finally {
        document.getElementById('chat-search-input').value = '';
    }
}
