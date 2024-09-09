import { userID } from "../user/updateProfile.js";

async function blockUser(target_id) {
    if (target_id === null || target_id === undefined || userID === null ) {
		throw new Error('Did not find userID or nickname invalid');
	}

	const response = await fetch('https://localhost:10444/livechat/' + userID + '/blacklist/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"target_id": target_id
		}),
		credentials: 'include'
	});
	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error(`${response.status}`);
	}
	if (responseData !== null) {
		console.log('USER LOG: BLOCK USER SUCCESSFUL');
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}