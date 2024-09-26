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

export async function openSingleTournamentModal(e) {
	try {
		document.getElementById('t-join').classList.add('hidden');
		document.getElementById('t-start').classList.add('hidden');
		document.getElementById('t-delete').classList.add('hidden');
		document.getElementById('t-player-name-label').classList.add('hidden');
		document.getElementById('t-player-name').classList.add('hidden');
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
		const has_started = (t_details.status !== 'Created');
		const is_admin = (t_details['admin-id'] === userID);
		const players = t_details.players;
		for (const playerKey in players) {
			if (players[playerKey].user_id === userID) {
				has_joined = true;
				break;
			}
		}
		document.getElementById("single-t-modal-title").innerText = `${t_name}`;

		if (has_started === false && has_joined === false) {
			t_modalText.innerText = `You have not joined this ${t_details.type == "Remote" ? "REMOTE" : "LOCAL"} tournament yet. Want to join?`;
			document.getElementById('t-player-name-label').classList.remove('hidden');
			document.getElementById('t-player-name').classList.remove('hidden');
			const joinButton = document.getElementById('t-join');
			joinButton.classList.remove('hidden');
			joinButton.dataset.tournid = t_id;
		}
		else if (has_joined === true) {
			if (is_admin === true && ((has_started === false && t_details.type == "Remote") || t_details.type == "Local")) {
				t_modalText.innerHTML = `<span>You are the admin. You can go play this ${t_details.type == "Remote" ? "REMOTE" : "LOCAL"} tournament or delete it.</span>
										</br>
										</br>
										<span>Status: ${t_details.status}</span>
										</br>
										 <span>Mode:  ${t_details.type}</span>
										</br>
										<span>Subscribed players: ${t_details.nb_players}</span>
										</br>
										<span>Max possible players: ${t_details.max_players}</span>`;
				const startButton = document.getElementById('t-start');
				const deleteButton = document.getElementById('t-delete');
				startButton.classList.remove('hidden');
				deleteButton.classList.remove('hidden');
				startButton.dataset.tournid = t_id;
				startButton.dataset.mode = t_details.type;
				deleteButton.dataset.tournid = t_id;
			}
			else if (has_started === false)
				t_modalText.innerText = `You are already a participant of this ${t_details.type == "Remote" ? "REMOTE" : "LOCAL"} tournament but it has not started yet.`;
			else if (has_started === true && t_details.type === 'Remote')
				t_modalText.innerText = `This REMOTE tournament has already started.
											You'll receive a notification in the livechat when it's your turn.`;
			else if (has_started === true && t_details.type === 'Local')
				t_modalText.innerText = `This tournament has already started, go play on ${t_details.players[0].nickname}'s computer!`;
		}

		else {
			t_modalText.innerText = 'Sorry, this tournament has already started without you!';

		}
		const t_modal = new bootstrap.Modal(document.getElementById('single-t-modal'));
		t_modal.show();
	}
	catch (e) {
		if (e.message === "500" || e.message === "502") {
			errormsg("Service temporarily unavailable", "join-and-tournament-errormsg");
			return ;
		}
		console.log("USER LOG: ", e.message);
	}
}
