import { userID, updateProfile } from '../user/updateProfile.js';
import { updateConvList } from './updateConvList.js';
import { set_is_blacklisted } from './blacklist.js';
import { errormsg } from '../../dom/errormsg.js'
import { displayChatInterface, displayMessages } from './messages.js';
import { getConvHistory } from './convHistory.js';

async function newConv(conv_nickname) {
    if (conv_nickname === null || conv_nickname === undefined || userID === null ) {
		throw new Error('403');
	}
	// else if (conv_nickname === localStorage.getItem('nickname')) {
	// 	throw new Error('Cannot add yourself to contact list');
	// }
	const response = await fetch('https://localhost:10443/api/livechat/' + userID + '/conversations/', {
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
		const response = await newConv(conv_nickname);
		const conv_id = response.conversation_id;

		const history = await getConvHistory(conv_id);
		set_is_blacklisted(history.is_blacklisted);
		updateConvList();
		const users = history.users;
		if (users.length === 2 && users[0].id === userID) {
			displayChatInterface(users[1].id);
		}
		else {
			displayChatInterface(users[0].id);
		}
		displayMessages(history);
		document.getElementById('chat-search-input').value = '';

	} catch (e) {
		if (e.message === '403') {
            updateProfile(false, null);
			return ;
        }
		console.error(`USER LOG: ${e.message}`);
		errormsg(e.message, 'livechat-errormsg');
	}
}
