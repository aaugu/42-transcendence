import { userID } from '../user/updateProfile.js';

export async function deleteTournament(tourn_id) {
	const response = await fetch('https://localhost:10443/api/tournament/' + tourn_id + '/', {
		method: 'DELETE',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"user_id": userID
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
		console.log('USER LOG: DELETE TOURNAMENT SUCCESSFUL');
	}
}