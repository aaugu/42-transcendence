import { errormsg } from "../../dom/errormsg.js";
import { urlRoute } from "../../dom/router.js";
import { createTournament } from "./createTournament.js";
import { hideModal } from "../../dom/modal.js";

export function tournamentOpenModal() {
	if (document.getElementById('tournament-name').value == "") {
		errormsg('Name cannot be empty', 't-create-errormsg');
		return;
	}
	const local = document.getElementById("t-local").checked;
	const t_modalText = document.getElementById("t-modal-text");
	const nr_players = document.getElementById("t-nr-players").value;
	if (local) {
		let playerInputs = `<p>Enter the player names</p>`;
		for (let i = 1; i <= nr_players; i++) {
			playerInputs += `
				<div class="mb-1 d-flex align-items-center">
					<label for="player-input-${i}" class="form-label me-2" style="flex: 0 0 150px;">Player ${i}:</label>
					<input type="text" class="form-control t-player-input">
				</div>`;
		}
        t_modalText.innerHTML = playerInputs;
	}
	else {
		t_modalText.innerHTML = `
			<p>Players can join your tournament from their profile.
			Anyone can start it once at least 2 players have joined.</p>
		`;
	}
	const t_modal = new bootstrap.Modal(document.getElementById('t-modal-names'));
	t_modal.show();
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

		await createTournament(new_tournament, local);
		hideModal();
		// refresh the join list
	}	
}
