import { errormsg } from '../../dom/errormsg.js';
import { urlRoute } from '../../dom/router.js';
import { hideModal } from '../../dom/modal.js';

//mode can  be local or remote
export async function createTournament(new_tournament, mode) {
	try {
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
		if (!response.ok) {
            // const error = await response.json();
			// if (response.status === 400) {
			// 	//check correct error codes
			// 	errormsg("Internal error, try again later", "t-modal-errormsg");
			// }
			throw new Error(`${response.status}`);
        }
		const responseData = await response.json();
        if (responseData !== null) {
            console.log("User log: TOURNAMENT CREATION SUCCESSFUL");
        } else {
            throw new Error('No response from server');
        }
	}
	catch (e){
		console.log(`User log: CREATE TOURNAMENT ${new_tournament.name} FAILED, STATUS: ${e.message}`);
		throw new Error('Create tournament failed, try again later');
	}
}

function newTournamentData(tournamentName, username, playerNames, is_private, password) {
	const new_tournament = {
		"name": tournamentName,
		"user_id": username,
		"max_players": playerNames.length,
		"player_names": playerNames,
		"is_private": is_private,
		"password": password
	};
	return new_tournament;
}

export async function tournamentCreateButton() {
	const local = document.getElementById("t-local").checked;
	var playerNames;
	var new_tournament;
	const username = localStorage.getItem('username') || 'guest';
	const tournamentName = document.getElementById('tournament-name').value;

	if (local) {
		const inputs = document.querySelectorAll('.t-player-input');
		try {
			inputs.forEach((input) => {
				if (input.value.trim() === '') {
					throw new Error("Fill out all fields");
				}
			});
			playerNames = Array.from(inputs).map(input => input.value);
			new_tournament = newTournamentData(tournamentName, username, playerNames, false, "");

			await createTournament(new_tournament, local);
			hideModal();
			urlRoute('/tournament/game');
		}
		catch (e){
			console.log("in catch, e.value: ", e.message);
			errormsg (e.message, "t-modal-errormsg");
		}

	}
	else {
		playerNames = [username];
		new_tournament = newTournamentData(tournamentName, username, playerNames, false, "");

		await createTournament(new_tournament, remote);
		hideModal();
		// refresh the join list
	}
}