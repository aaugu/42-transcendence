import { userID } from "../user/updateProfile.js";

export async function getContacts() {
	if (userID === null) {
		throw new Error('Did not find user ID');
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
		console.log(`USER LOG: ${responseData.message}`);
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}
