import { userID } from "../user/updateProfile.js";

export async function getAllConversations() {
	if (userID === null) {
		throw new Error('USER LOG: Did not find user ID');
	}

	const response = await fetch('https://localhost:10444/livechat/' + userID + '/conversations/', {
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
		console.log('USER LOG: FETCH GET ALL CONVERSATIONS SUCCESSFUL');
		return responseData;
	} else {
		throw new Error('USER LOG: No response from server');
	}
}
