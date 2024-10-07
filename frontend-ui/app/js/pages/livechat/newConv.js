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
	const responseData = null;
    if (!response.ok) {
        try {
            responseData = await response.json();
        } catch (e) {
            throw new Error(`${response.status}`);
        }
        if (responseData.errors)
            throw new Error(`${responseData.errors}`);
        throw new Error(`${responseData.status}`);
    }
    try {
        responseData = await response.json();
        if (responseData !== null) {
            return responseData;
        }
    } catch (e) {
        throw new Error(`${response.status}`);
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
		console.log(e.message);
		if (e.message === "500" || e.message === "502") {
			errormsg("Service temporarily unavailable", 'homepage-errormsg');;
		} else if (e.message === '403' || e.message === "401") {
            updateProfile(false, null);
			errormsg('You were redirected to the landing page', 'homepage-errormsg');
		} else {
			errormsg(e.message, 'homepage-errormsg');
		}
	}
}
