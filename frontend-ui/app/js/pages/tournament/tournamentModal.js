import { errormsg } from "../../dom/errormsg.js";
import { createTournament } from "./createTournament.js";

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

export function tournamentCreateButton() {
	const local = document.getElementById("t-local").checked;
	var playerNames;
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
		}
		catch (e){
			errormsg ("Fill out all fields", "t-modal-errormsg");
			return;
		}
		playerNames = Array.from(inputs).map(input => input.value);
	}
	else {
		playerNames = [username];
	}
	console.log("playerNames, tournamentName: ", playerNames, tournamentName);
	//Fetch request to create tournament
	// createTournament(tournamentName, username, playerNames.length, playerNames);
}
