import { displayChatInterface } from './messages.js';
import { userID } from '../user/updateProfile.js';
import { updateConvList } from './updateConvList.js';
import { set_is_blacklisted } from './blacklist.js';
import { all_conversations } from './conversations.js';

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
	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error(`${response.status}`);
	}
	if (responseData !== null) {
		console.log('USER LOG: CREATE NEW CONV SUCCESSFUL');
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}

export async function newConvButton(e) {
	const conv_nickname = document.getElementById('chat-search-input').value;
	try {
		await newConv(conv_nickname);
		updateConvList();
		set_is_blacklisted(false);
	} catch (e) {
		console.error(`USER LOG: ${e.message}`);
	}
	finally {
        document.getElementById('chat-search-input').value = '';
    }
}
