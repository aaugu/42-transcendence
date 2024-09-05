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
	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error(`${response.status}`);
	}
	if (responseData !== null) {
		console.log('USER LOG: CHANGE TOURNAMENT STATUS SUCCESSFUL');
	} else {
		throw new Error('No response from server');
	}
}

export async function startTournamentButton() {
	try {
		const tournament_name = document.getElementById('single-t-modal-title').innerText;
		const tournament_id = get_tournament_id(tournament_name);

		await changeStatusTournament(tournament_id, 'start');

	}
	catch (e) {
		console.error(`USER LOG: ERROR STARTING ${tournament_name}: ${e.message}`);
		errormsg("Could not start tournament", "single-t-modal-errormsg");
	}
}