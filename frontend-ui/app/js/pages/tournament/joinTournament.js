import { userID } from '../user/updateProfile.js';
import { get_tournament_id } from './tournament.js';
import { errormsg } from '../../dom/errormsg.js';

async function joinTournament(nickname, tournament_id) {
	const response = await fetch('https://localhost:10444/api/tournament/' + tournament_id + '/players/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"user_id": userID,
			"nickname": nickname,
		}),
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
	} else {
		throw new Error('No response from server');
	}
}

export async function joinTournamentButton() {
	try {
		const nickname = localStorage.getItem('nickname') || 'guest';
		const tournament_name = document.getElementById('single-t-modal-text').innerText;
		const tournament_id = get_tournament_id(tournament_name);

		await joinTournament(nickname, tournament_id);
	}
	catch (e) {
		console.error(`USER LOG: ${nickname} COULD NOT JOIN TOURNAMENT, STATUS: ${e.message}`);
		errormsg(e.message, "single-t-modal-errormsg");
	}
}