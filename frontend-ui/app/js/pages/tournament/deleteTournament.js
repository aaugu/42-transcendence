import { userID } from '../user/updateProfile.js';

export async function deleteTournament(tourn_id) {
	const response = await fetch('https://' + window.location.host + '/api/tournament/' + tourn_id + '/', {
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

	if (!response.ok)
		throw new Error(`${response.status}`);
}