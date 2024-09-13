import { userID } from '../user/updateProfile.js';

export async function startTournament(tournament_id) {
	const url = 'https://localhost:10444/api/tournament/' + tournament_id + '/start/';
	const response = await fetch(url, {
		method: 'PATCH',
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
		console.log(`TOURNAMENT LOG: ${responseData.message}`);
	} else {
		throw new Error('No response from server');
	}
}
