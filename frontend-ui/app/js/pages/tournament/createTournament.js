import { errormsg } from '../../dom/errormsg.js';
import { urlRoute } from '../../dom/router.js';
import { hideModal } from '../../dom/modal.js';
import { userID } from '../user/updateProfile.js';
import { updateTournLists } from './updateTournLists.js';

//mode can  be local or remote
async function createTournament(new_tournament) {
	const response = await fetch('https://localhost:10444/api/tournament/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"name": new_tournament.name,
			"type": new_tournament.mode,
			"user_id": new_tournament.user_id,
			"max_players": new_tournament.max_players,
			"player_names": new_tournament.player_names,
			"is_private": new_tournament.is_private,
			"password": new_tournament.password
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
		console.log('USER LOG: CREATE TOURNAMENT SUCCESSFUL');
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}

function newTournamentData(tournamentName, max_players, adminNickname, is_private, password, mode) {
	const new_tournament = {
		"name": tournamentName,
		"user_id": userID,
		"type": mode,
		"max_players": max_players,
		"player_names": adminNickname,
		"is_private": is_private,
		"password": password
	};
	return new_tournament;
}

export async function createTournamentButton() {
	const local = document.getElementById("t-local").checked;
	const tournamentName = document.getElementById('tournament-name').value;
	const max_players = document.getElementById('t-nr-players').value;
	const adminElement = document.getElementById('t-admin-nickname');
	const adminNickname = (adminElement.value.trim() !== '') ? adminElement.value : localStorage.getItem('nickname');
	try {
		var mode;
		if (local) {
			mode = 'local';
		}
		else {
			mode = 'remote';
		}
		const new_tournament = newTournamentData(tournamentName, max_players, adminNickname, false, "", mode);
		await createTournament(new_tournament);
		updateTournLists();
		hideModal('create-t-modal');
		document.getElementById("t-nr-players").value = 2;
		document.getElementById('tournament-name').value = "";
	}
	catch (e) {
		console.log(`USER LOG: CREATE TOURNAMENT ${new_tournament.name} FAILED, STATUS: ${e.message}`);
		errormsg (e.message, "t-modal-errormsg");
	}
}