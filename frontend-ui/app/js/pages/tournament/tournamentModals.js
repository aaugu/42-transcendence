import { errormsg } from "../../dom/errormsg.js";
import { get_tournament_id } from "./tournament.js";
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

//tournament status 0 = created, 1 = in_progress, 2 = finished
export async function openSingleTournamentModal(e) {
	try {
		let has_joined = false;
		const nickname = localStorage.getItem('nickname');
		const t_modalText = document.getElementById("single-t-modal-text");
		const t_name = e.target.innerText;
		const t_id = get_tournament_id(t_name);
		if (!t_id) {
			throw new Error('Could not find tournament');
		}
		const t_details = await getTournamentDetails(t_id);
		const has_started = (t_details.status === 0);
		const players = t_details.players;
		for (const playerKey in players) {
			if (players[playerKey].nickname === nickname) {
				has_joined = true;
				break;
			}
		}

		// const has_joined = true;
		// const has_started = false;
		// console.log("user has_joined: ", has_joined, "user has_started: ", has_started);

		document.getElementById("single-t-modal-title").innerText = t_name;
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
		else {
			t_modalText.innerText = 'Sorry, this tournament has already started without you!';

		}
		const t_modal = new bootstrap.Modal(document.getElementById('single-t-modal'));
		t_modal.show();
	}
	catch (e) {
		console.log("USER LOG: ", e.message);
	}
}
