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
	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error(`${response.status}`);
	}
	if (responseData !== null) {
		console.log(`USER LOG: ${responseData.message}`);
	} else {
		throw new Error('No response from server');
	}
}

export async function joinTournamentButton() {
	const nickname = localStorage.getItem('nickname') || 'guest';
	const tournament_name = document.getElementById("single-t-modal-title").innerText;
	const tournament_id = get_tournament_id(tournament_name);
	try {
		// console.log("nickname: ", nickname, "tournament_name:", tournament_name, "tournament_id: ", tournament_id);

		await joinTournament(nickname, tournament_id);
	}
	catch (e) {
		console.error(`USER LOG: ${nickname} COULD NOT JOIN TOURNAMENT ${tournament_name}, STATUS: ${e.message}`);
		errormsg('Not possible, try again later', "single-t-modal-errormsg");
	}
}