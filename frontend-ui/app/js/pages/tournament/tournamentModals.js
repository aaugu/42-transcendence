import { errormsg } from "../../dom/errormsg.js";
import { all_tournaments } from "./tournamentPage.js";
import { getTournamentDetails } from "./getTournaments.js";
import { userID } from "../user/updateProfile.js";

export function openCreateTournamentModal() {
	if (document.getElementById('tournament-name').value == "") {
		errormsg('Name cannot be empty', 't-create-errormsg');
		return;
	}
	const local = document.getElementById("t-local").checked;
	const t_modalText = document.getElementById("create-t-modal-text");
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
	const t_modal = new bootstrap.Modal(document.getElementById('create-t-modal'));
	t_modal.show();
}

export async function openSingleTournamentModal(e) {
	try {
		const t_modalText = document.getElementById("single-t-modal-text");
		const t_name = e.target.innerText;
		const t_values = Object.values(all_tournaments);
		const tournament = t_values.find(t => t.name === t_name);
		const t_id = tournament ? tournament.id : null;
		if (!t_id) {
			throw new Error('Could not find tournament');
		}
		const t_details = await getTournamentDetails(t_id);

		const has_joined = (t_details.find(localStorage.getItem(nickname)) !== undefined);
		//check what the different statuses are
		const has_started = (t_details.find('status') === 'created');

		console.log("user has_joined: ", has_joined, "user has_started: ", has_started);

		if (has_started === false && has_joined === false) {
			t_modalText.innerText = 'You have not joined this tournament yet. Want to join?';
			const joinButton = document.getElementById('t-join');
			joinButton.classList.remove('hidden');
		}
		else if (has_started === false && has_joined === true){
			t_modalText.innerText = 'You are already a participant of this tournament. Wanna start it?';
			const startButton = document.getElementById('t-start');
			startButton.classList.remove('hidden');
		}
		else if (has_started === true && has_joined === true){
			t_modalText.innerText = 'The tournament has already started. Go play!';
			const playButton = document.getElementById('t-play');
			playButton.classList.remove('hidden');
		}
		const t_modal = new bootstrap.Modal(document.getElementById('single-t-modal'));
		t_modal.show();
	}
	catch (e) {
		console.error("User log: ", e.message);
	}
}
