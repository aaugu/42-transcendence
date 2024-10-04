import { errormsg } from '../../dom/errormsg.js';
import { urlRoute } from '../../dom/router.js';
import { hideModal } from '../../dom/modal.js';
import { userID } from '../user/updateProfile.js';
import { updateTournLists } from './updateTournLists.js';
import { escapeHTML } from "../../livechat/startLivechat.js";

//type can  be local or remote
async function createTournament(new_tournament) {
	const response = await fetch('https://' + window.location.host + '/api/tournament/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"name": new_tournament.name,
			"type": new_tournament.type,
			"user_id": new_tournament.user_id,
			"max_players": new_tournament.max_players,
			"player_names": new_tournament.player_names
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

function newTournamentData(tournamentName, max_players, adminNickname, type) {
	const new_tournament = {
		"name": tournamentName,
		"user_id": userID,
		"type": type,
		"max_players": max_players,
		"player_names": adminNickname
	};
	return new_tournament;
}

export async function createTournamentButton() {
	const local = document.getElementById("t-local").checked;
	const tournamentName = escapeHTML(document.getElementById('tournament-name').value);
	const max_players = escapeHTML(document.getElementById('t-nr-players').value);
	var adminNickname;
	if (document.getElementById('t-admin-nickname').value === '')
		adminNickname = localStorage.getItem('nickname');
	else
		adminNickname = escapeHTML(document.getElementById('t-admin-nickname').value);
	try {
		var type;
		if (local) {
			type = 'local';
		}
		else {
			type = 'remote';
		}
		const new_tournament = newTournamentData(tournamentName, parseInt(max_players), adminNickname, type);
		await createTournament(new_tournament);
		updateTournLists();
		setTimeout(() => {
			hideModal('create-t-modal');
        }, 500);
		document.getElementById("t-nr-players").value = 2;
		document.getElementById('tournament-name').value = "";
	}
	catch (e) {
		if (e.message === "500" || e.message === "502") {
			errormsg("Service temporarily unavailable", "t-modal-errormsg");
		} else {
			errormsg (e.message, "t-modal-errormsg");
		}
	}
}