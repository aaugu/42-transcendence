import { displayChatInterface, displayMessages } from "./messages.js";

async function getConvHistory(conv_id) {
    if (conv_id === null || conv_id === undefined)
		throw new Error('USER LOG: Did not find conversation ID');

	const response = await fetch('https://localhost:10444/livechat/conversation/' + conv_id + '/messages/', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});
	if (!response.ok) {
		if (response.errors)
			throw new Error(`${response.errors}`);
		throw new Error(`${response.status}`);
	}
	const responseData = await response.json();
	if (responseData !== null) {
		console.log('USER LOG: FETCH CONVERSATION HISTORY SUCCESSFUL');
		return responseData;
	} else {
		throw new Error('USER LOG: No response from server');
	}
}

export async function convHistory(e) {
    try {
		const targetElement = e.target.closest('.list-group-item').querySelector('[data-convid]');
        const conv_id = targetElement ? targetElement.dataset.convid : null;

		const response = await getConvHistory(conv_id);
		displayChatInterface();
		displayMessages(response);
    }
    catch (e) {
        console.error("USER LOG: ", e.message);
    }
}