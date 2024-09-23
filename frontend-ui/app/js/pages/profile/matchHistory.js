import { userID } from "../user/updateProfile.js"

export async function matchHistory (id = null) {
	const user_id = id || userID;
    if (user_id === null) {
        throw new Error('Could not find user ID');
    }

    const response = await fetch('https://localhost:10443/api/pong/retrieve-last-games/' + user_id + '/10', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});
	if (!response.ok) {
		if (response.status === 500 || response.status === 502)
			throw new Error('Server error');
		const data = await response.json();
		if (data.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error(`${response.status}`);
	}
	const responseData = await response.json();
	if (responseData !== null) {
		console.log('USER LOG: GET FRIEND LIST SUCCESSFUL');
		return responseData.online_statuses;
	}
}