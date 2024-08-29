import { errormsg } from '../../dom/errormsg.js';
import { get_tournament_id } from './tournament.js';

//status: start, end
async function changeStatusTournament(tournament_id, game_status) {
	const url = 'https://localhost:10444/api/tournament/' + tournament_id + '/' + game_status + '/';
	const response = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: null,
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

export async function startTournamentButton() {
	try {
		const tournament_name = document.getElementById('single-t-modal-text').innerText;
		const tournament_id = get_tournament_id(tournament_name);

		await changeStatusTournament(tournament_id, 'start');

	}
	catch (e) {
		console.error(`USER LOG: ERROR STARTING ${tournament_name}: ${e.message}`);
		errormsg("Could not start tournament", "single-t-modal-errormsg");
	}
}