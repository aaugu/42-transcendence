import { userID } from '../user/updateProfile.js';
import { errormsg } from '../../dom/errormsg.js';
import { hideModal } from '../../dom/modal.js';

async function joinTournament(nickname, tournament_id) {
	const response = await fetch('https://' + window.location.host + '/api/tournament/' + tournament_id + '/players/', {
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

	if (!response.ok && ( response.status === 502 || response.status === 500))
		throw new Error(`${response.status}`);

	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error(`${response.status}`);
	}
}

export async function joinTournamentButton() {
	const nicknameTarget = document.getElementById('t-player-name');
	const nickname = nicknameTarget.value.trim() !== '' ? nicknameTarget.value : localStorage.getItem('nickname');
	const tournament_name = document.getElementById("single-t-modal-title").innerText;
	const tourn_id = document.getElementById('t-join').dataset.tournid;
	try {
		await joinTournament(nickname, tourn_id);
		setTimeout(() => {
			hideModal('single-t-modal');
        }, 500);
	}
	catch (e) {
		if (e.message === "500" || e.message === "502") {
			errormsg("Service temporarily unavailable", "single-t-modal-errormsg");
		}
		else {
			errormsg(e.message, "single-t-modal-errormsg");
		}
		setTimeout(() => {
			hideModal('single-t-modal');
		}, 500);
	}
}