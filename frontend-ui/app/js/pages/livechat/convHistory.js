import { displayChatInterface, displayMessages } from "./messages.js";

async function getConvHistory(conv_id) {
	console.log("conv_id: ", conv_id);
    if (conv_id === null || conv_id === undefined)
		throw new Error('Did not find conversation ID');

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
		console.log(`USER LOG: ${responseData.message}`);
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}

export async function convHistory(e) {
    try {
        const conv_id = e.target.dataset.convid;

        const response = await getConvHistory(conv_id);
        console.log("response convHistory: ", response);
		displayChatInterface();
		displayMessages(response);
    }
    catch (e) {
        console.error("USER LOG: ", e.message);
    }
}