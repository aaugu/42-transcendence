import { displayChatInterface } from './messages.js';
import { userID } from '../user/updateProfile.js';

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
	const conv_nickname = document.getElementById('chat-search-input').value;
	try {
		const response = await newConv(conv_nickname);
		console.log("response newConvButton: ", response);
		displayChatInterface();

		//add conversation to the list of conversations

	} catch (e) {
		console.error(`USER LOG: ${e.message}`);
	}
	finally {
        document.getElementById('chat-search-input').value = '';
    }
}
