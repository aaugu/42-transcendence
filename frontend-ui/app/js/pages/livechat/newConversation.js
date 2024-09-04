import { displayMessages } from './messages.js';

async function newConv(conv_nickname) {
    // if (conv_nickname === null || conv_nickname === undefined || userID === null ) {
	// 	throw new Error('Did not find userID or nickname invalid');
	// }

	// const response = await fetch('https://localhost:10444/livechat/' + userID + '/conversations/', {
	// 	method: 'POST',
	// 	headers: {
	// 		'Accept': 'application/json',
	// 		'Content-Type': 'application/json',
	// 	},
	// 	body: JSON.stringify({
	// 		"nickname": conv_nickname
	// 	}),
	// 	credentials: 'include'
	// });
	// if (!response.ok) {
	// 	if (response.errors)
	// 		throw new Error(`${response.errors}`);
	// 	throw new Error(`${response.status}`);
	// }
	// const responseData = await response.json();
	// if (responseData !== null) {
	// 	console.log(`USER LOG: ${responseData.message}`);
	// 	return responseData;
	// } else {
	// 	throw new Error('No response from server');
	// }
	const response = {
		"messages": [
			{
				"author": 1,
				"message": "angela",
				"date": "2024-08-22",
				"time": "13:02"
			},
			{
				"author": 1,
				"message": "breaks I somehow don't know what to write just writ ea lot of test ahsdfkhaslkdjfhalskdjfhalskdjfalsjfalsjfasjfasfsjdfsajflks",
				"date": "2024-08-22",
				"time": "13:03"
			},
			{
				"author": 4,
				"message": "not",
				"date": "2024-08-22",
				"time": "13:04"
			},
			{
				"author": 4,
				"message": "neo",
				"date": "2024-08-22",
				"time": "13:10"
			}
		],
		"users": [
			{
				"id": 2,
				"username": "bli",
				"nickname": "bli",
				"email": "bli@gmail.com",
				"is_2fa_enabled": false,
				"avatar": "images/default_avatar.png",
				"online": false
			},
			{
				"id": 4,
				"username": "blo",
				"nickname": "blo",
				"email": "blo@gmail.com",
				"is_2fa_enabled": false,
				"avatar": "images/default_avatar.png",
				"online": false
			}
		]
	};
	return response;
}

export async function newConvButton(e) {
	e.preventDefault();
	const conv_nickname = document.getElementById('chat-search-input').value;
	try {
		const response = await newConv(conv_nickname);
		displayMessages(response);
		//add conversation to the list of conversations

	} catch (e) {
		console.error(`USER LOG: ${e.message}`);
	}
	finally {
        document.getElementById('chat-search-input').value = '';
    }
}
