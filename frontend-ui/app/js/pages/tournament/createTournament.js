import { errormsg } from '../../dom/errormsg.js';
import { urlRoute } from '../../dom/router.js';
import { hideModal } from '../../dom/modal.js';
import { userID } from '../user/updateProfile.js';
import { updateTournLists } from './updateTournLists.js';

//mode can  be local or remote
async function createTournament(new_tournament, mode) {
	const response = await fetch('https://localhost:10444/api/tournament/' + mode + '/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"name": new_tournament.name,
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

function newTournamentData(tournamentName, playerNames, max_players, is_private, password) {
	const new_tournament = {
		"name": tournamentName,
		"user_id": userID,
		"max_players": max_players,
		"player_names": playerNames,
		"is_private": is_private,
		"password": password
	};
	return new_tournament;
}

export async function createTournamentButton() {
	const local = document.getElementById("t-local").checked;
	var playerNames;
	var new_tournament;
	const nickname = localStorage.getItem('nickname') || 'guest';
	const tournamentName = document.getElementById('tournament-name').value;

	try {
		if (local) {
			const inputs = document.querySelectorAll('.t-player-input');
			inputs.forEach((input) => {
				if (input.value.trim() === '') {
					throw new Error("Fill out all fields");
				}
			});
			playerNames = Array.from(inputs).map(input => input.value);
			new_tournament = newTournamentData(tournamentName, playerNames, playerNames.length, false, "");

			const response = await createTournament(new_tournament, 'local');
			hideModal('create-t-modal');
			localStorage.setItem('tourn_id', response.id);
			urlRoute('/tournament/local');
		}
		else {
			playerNames = nickname;
			const max_players = document.getElementById('t-nr-players').value;
			new_tournament = newTournamentData(tournamentName, playerNames, parseInt(max_players), false, "");

			console.log("new tournament data: ", new_tournament);
			await createTournament(new_tournament, 'remote');
			updateTournLists();
			hideModal('create-t-modal');
		}
		document.getElementById("t-nr-players").value = 2;
		document.getElementById('tournament-name').value = "";
	}
	catch (e) {
		console.log(`USER LOG: CREATE TOURNAMENT ${new_tournament.name} FAILED, STATUS: ${e.message}`);
		errormsg (e.message, "t-modal-errormsg");
	}
}