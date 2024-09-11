import { errormsg } from '../../dom/errormsg.js';
import { hideModal } from '../../dom/modal.js';
import { userID } from '../user/updateProfile.js';

async function startTournament(tournament_id) {
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
		console.log('USER LOG: CHANGE TOURNAMENT STATUS SUCCESSFUL');
	} else {
		throw new Error('No response from server');
	}
}

export async function generateMatches(tournament_id) {
	const url = 'https://localhost:10444/api/tournament/' + tournament_id + '/matches/generate/';
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
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
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}



export async function startTournamentButton() {
	try {
		const tourn_id = document.getElementById('t-start').dataset.tournid;

		const matches = await generateMatches(tourn_id);
		console.log('matches: ', matches);
		await startTournament(tourn_id);
		document.getElementById('t-start').classList.add('hidden');
		hideModal('single-t-modal');
	}
	catch (e) {
		const tournament_name = document.getElementById('single-t-modal-title').innerText;
		console.error(`USER LOG: ERROR STARTING ${tournament_name}: ${e.message}`);
		errormsg(e.message, "single-t-modal-errormsg");
		setTimeout(() => {
			hideModal('single-t-modal');
			document.getElementById('t-start').classList.add('hidden');
		}, 1000);
	}
}