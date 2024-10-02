import { userID, updateProfile } from '../user/updateProfile.js';
import { updateConvList } from './updateConvList.js';
import { set_contact_blacklisted } from './blacklist.js';
import { errormsg } from '../../dom/errormsg.js'
import { displayChatInterface, displayMessages } from './messages.js';
import { getConvHistory } from './convHistory.js';
import { startLivechat } from './startLivechat.js';
import { error500 } from '../errorpage/error500.js';

async function newConv(conv_nickname) {
    if (conv_nickname === null || conv_nickname === undefined || userID === null ) {
		throw new Error('403');
	}
	const response = await fetch('https://' + window.location.host + '/api/livechat/' + userID + '/conversations/', {
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
			throw new Error('Not possible');
		throw new Error(`${response.status}`);
	}
	const responseData = await response.json();
	if (responseData !== null) {
		return responseData;
	}
}

export async function newConvButton() {
	const conv_nickname = document.getElementById('chat-search-input').value;
	try {
		const response = await newConv(conv_nickname);
		const conv_id = response.conversation_id;

		const history = await getConvHistory(conv_id);
		set_contact_blacklisted(history.contact_blacklisted);
		updateConvList();
		const users = history.users;
		if (users.length === 2 && users[0].id === userID) {
			displayChatInterface(users[1].id, conv_nickname);
		}
		else {
			displayChatInterface(users[0].id, conv_nickname);
		}
		startLivechat(conv_id, history);
		displayMessages(history, false);
		document.getElementById('chat-search-input').value = '';

	} catch (e) {
		if (e.message === '403') {
            updateProfile(false, null);
        } else if (e.message === "500" || e.message === "502") {
			errormsg("Service temporarily unavailable", 'livechat-errormsg');;
		} else {
			errormsg(e.message, 'livechat-errormsg');
		}
	}
}
