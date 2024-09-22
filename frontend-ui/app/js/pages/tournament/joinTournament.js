import { userID } from '../user/updateProfile.js';
import { errormsg } from '../../dom/errormsg.js';
import { hideModal } from '../../dom/modal.js';

async function joinTournament(nickname, tournament_id) {
	const response = await fetch('https://localhost:10443/api/tournament/' + tournament_id + '/players/', {
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
		console.log('USER LOG: JOIN TOURNAMENT SUCCESSFUL');
	}
}

export async function joinTournamentButton() {
	const nicknameTarget = document.getElementById('t-player-name');
	const nickname = nicknameTarget.value.trim() !== '' ? nicknameTarget.value : localStorage.getItem('nickname');
	const tournament_name = document.getElementById("single-t-modal-title").innerText;
	const tourn_id = document.getElementById('t-join').dataset.tournid;
	try {
		await joinTournament(nickname, tourn_id);
		hideModal('single-t-modal');
	}
	catch (e) {
		console.error(`USER LOG: ${nickname} COULD NOT JOIN TOURNAMENT ${tournament_name}, STATUS: ${e.message}`);
		errormsg(e.message, "single-t-modal-errormsg");
		setTimeout(() => {
			hideModal('single-t-modal');
		}, 1000);
	}
}