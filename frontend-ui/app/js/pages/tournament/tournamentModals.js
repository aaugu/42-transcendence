import { errormsg } from "../../dom/errormsg.js";
import { all_tournaments } from "./tournamentPage.js";

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

export function openSingleTournamentModal(e) {
	var has_joined = false;
	var has_started = false;
	const t_modalText = document.getElementById("single-t-modal-text");
	const t_name = e.target.innerText;

	if (has_started === false && has_joined === false) {
		//if has_joined and has_started are false, show join html modal
        t_modalText.innerText = 'You have not joined this tournament yet. Want to join?';
	}
	else if (has_started === false && has_joined === true){
		//if has_joined is true, has_started is false, show start html modal
		t_modalText.innerText = 'You are already a participant of this tournament. Wanna start it?';
	}
	else if (has_started === true && has_joined === true){
		//if has_joined is true, has_started is true, show go to tournament html modal
		t_modalText.innerText = 'The tournament has already started. Go play!';
	}
	const t_modal = new bootstrap.Modal(document.getElementById('single-t-modal'));
	t_modal.show();
}