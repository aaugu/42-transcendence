import { errormsg } from "../../dom/errormsg.js";
import { getTournamentDetails } from "./getTournaments.js";
import { userID } from "../user/updateProfile.js";

export function openCreateTournamentModal() {
	if (document.getElementById('tournament-name').value == "") {
		errormsg('Name cannot be empty', 't-create-errormsg');
		return;
	}
	const t_modalText = document.getElementById("create-t-modal-text");
	t_modalText.innerHTML = `
		<p>Players can join your tournament from their profile.
		You can start it once at least 2 players have joined.</p>
		<label class="form-label" for="t-admin-nickname">Choose a player name or go with your nickname</label>
		<input type="text" class="form-control" id="t-admin-nickname" placeholder="">
	`;
	const t_modal = new bootstrap.Modal(document.getElementById('create-t-modal'));
	t_modal.show();
}

//tournament status 0 = created, 1 = in_progress, 2 = finished
export async function openSingleTournamentModal(e) {
	try {
		let has_joined = false;
		const t_modalText = document.getElementById("single-t-modal-text");
		const t_name = e.target.innerText;
		const targetElement = e.target.closest('.list-group-item').querySelector('[data-tournid]');
        const t_id = targetElement ? targetElement.dataset.tournid : null;
		if (t_id === null) {
			throw new Error('Could not find tournament');
		}
		const t_details = await getTournamentDetails(t_id);
		console.log("t_details: ", t_details);
		const has_started = (t_details.status === 0);
		const is_admin = (t_details['admin-id'] === userID);
		const players = t_details.players;
		for (const playerKey in players) {
			if (players[playerKey].user_id === userID) {
				has_joined = true;
				break;
			}
		}

		document.getElementById("single-t-modal-title").innerText = t_name;
		if (has_started === false && has_joined === false) {
			t_modalText.innerText = 'You have not joined this tournament yet. Want to join?';
			document.getElementById('t-player-name-label').classList.remove('hidden');
			document.getElementById('t-player-name').classList.remove('hidden');
			const joinButton = document.getElementById('t-join');
			joinButton.classList.remove('hidden');
			joinButton.dataset.tournid = t_id;
		}
		else if (has_started === false && has_joined === true){
			if (is_admin === true) {
				t_modalText.innerText = 'You are the admin. Wanna start this tournament?';
				const startButton = document.getElementById('t-start');
				startButton.classList.remove('hidden');
				startButton.dataset.tournid = t_id;
			}
			else
				t_modalText.innerText = 'You are already a participant of this tournament but it has not started yet.';
		}
		else if (has_started === true && has_joined === true){
			t_modalText.innerText = 'The tournament has already started. Go play!';
			const playButton = document.getElementById('t-play');
			playButton.classList.remove('hidden');
			playButton.dataset.tournid = t_id;
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
