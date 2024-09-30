import { userID } from './updateProfile.js';

export async function logout() {
	if (userID === null) {
		throw new Error('No user ID found');
	}

    const response = await fetch('https://' + window.location.host + '/api/login/token/logout/' + userID + '/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});

	if (!response.ok && response.status === 502)
		throw new Error(`${response.status}`);

	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.Detail)
			throw new Error(`${responseData.Detail}`);
		throw new Error('LOGOUT FAILED');
	}
}
