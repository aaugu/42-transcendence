import { displayChatInterface, displayMessages } from "./messages.js";
import { userID } from '../user/updateProfile.js';
import { set_is_blacklisted } from "./blacklist.js";

export async function getConvHistory(conv_id) {
    if (conv_id === null || conv_id === undefined || userID === null )
		throw new Error('Did not find conversation ID');

	const response = await fetch('https://localhost:10443/api/livechat/'+ userID + '/conversation/' + conv_id + '/messages/', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});

	if (!response.ok) {
		if (response.status === 404)
			throw new Error('Conversation could not be found');
		throw new Error(`${response.status}`);
	}
	const responseData = await response.json();
	if (responseData !== null) {
		console.log('USER LOG: FETCH CONVERSATION HISTORY SUCCESSFUL');
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}

export async function convHistory(e) {
    try {
		const targetElement = e.target.closest('.list-group-item').querySelector('[data-convid]');
		const secondTargetElement = e.target.closest('.list-group-item').querySelector('[data-ctcid]');
        const conv_id = targetElement ? targetElement.dataset.convid : null;
		const ctc_id = secondTargetElement ? secondTargetElement.dataset.ctcid : null;

		const response = await getConvHistory(conv_id);
		set_is_blacklisted(response.is_blacklisted);
		displayChatInterface(ctc_id);
		displayMessages(response);
    }
    catch (e) {
		if (e.message === "403") {
            updateProfile(false, null);
			errormsg('You were automatically logged out', 'homepage-errormsg');
			return ;
        }
        console.error("USER LOG: ", e.message);
		errormsg(e.message, 'livechat-errormsg');
    }
}