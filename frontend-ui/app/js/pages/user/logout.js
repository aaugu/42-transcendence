import { userID } from './updateProfile.js';

export async function logout() {
	if (userID === null) {
		throw new Error('No user ID found');
	}

    const response = await fetch('https://localhost:10443/api/login/token/logout/' + userID + '/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});
	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.Detail)
			throw new Error(`${responseData.Detail}`);
		throw new Error('LOGOUT FAILED');
	}
	if (responseData !== null) {
		console.log('LOGOUT SUCCESSFUL');
	} else {
		throw new Error('No response from server');
	}
}
