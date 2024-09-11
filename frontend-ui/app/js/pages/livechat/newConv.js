import { userID } from '../user/updateProfile.js';
import { updateConvList } from './updateConvList.js';
import { set_is_blacklisted } from './blacklist.js';
import { errormsg } from '../../dom/errormsg.js'
import { undisplayChatInterface } from './messages.js';

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
		if (response.status === 404)
			throw new Error('User does not exist');
		else if (response.status === 409)
			throw new Error('User already added to contact list');
		throw new Error(`${response.status}`);
	}
	const responseData = await response.json();
	if (responseData !== null) {
		console.log('USER LOG: CREATE NEW CONV SUCCESSFUL');
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}

export async function newConvButton() {
	const conv_nickname = document.getElementById('chat-search-input').value;
	try {
		await newConv(conv_nickname);
		updateConvList();
		set_is_blacklisted(false);
		undisplayChatInterface();

	} catch (e) {
		console.error(`USER LOG: ${e.message}`);
		errormsg(e.message, 'livechat-errormsg');
	}
	finally {
        document.getElementById('chat-search-input').value = '';
    }
}
