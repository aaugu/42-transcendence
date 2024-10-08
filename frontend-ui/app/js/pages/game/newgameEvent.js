import { getGameID, createTournamentGame } from './gameplay/createnewGame.js'
import { urlRoute } from '../../dom/router.js';
import { hideModal } from '../../dom/modal.js';
import { errormsg } from '../../dom/errormsg.js';
import { Tournament, RemoteTournament } from './gameplay-tournament/tournamentClass.js';
import { getTournamentDetails } from '../tournament/getTournaments.js';
import { error500 } from "../errorpage/error500.js";
import { updateProfile } from '../user/updateProfile.js';

export async function newlocalgameEvent() {
	try {
		localStorage.removeItem('right');
		localStorage.removeItem('left');
		const newGameId = await getGameID();
		const new_url = `/local-twoplayer/${newGameId}`;
		urlRoute(new_url);
	} catch (e) {
		if (e.message === "500" || e.message === "502") {
			const error = document.getElementById('main-content');
			error.innerHTML = error500();
		}
		else if (e.message === "401" || e.message === "403") {
			updateProfile(false, null);
			errormsg('You were redirected to the landing page', 'homepage-errormsg');
		}
		else {
			errormsg(e.message, 'homepage-errormsg');
		}
	}
}

export async function newtournamentgameEvent(tourn_id) {
	if (tourn_id) {
		try {
			let tournament;
			localStorage.setItem('tourn_id', tourn_id);
			const t_details = await getTournamentDetails(tourn_id);

			if (t_details.status === 'In Progress') {
				tournament = new Tournament(tourn_id, 'In Progress');
				await tournament.continueTournament();
			}
			else if (t_details.status === 'Created') {
				tournament = new Tournament(tourn_id, 'Created');
				await tournament.launchTournament();
			}

			const player1_id = tournament.current_match.player_1.user_id;
			const player2_id = tournament.current_match.player_2.user_id;
			const response = await createTournamentGame(player1_id, player2_id, "TOURNAMENT");
			const newGameId = response.game_id;
			const new_url = `/tournament/${newGameId}`;
			hideModal('single-t-modal');
			urlRoute(new_url);
		}
		catch (e) {
			if (e.message === "500" || e.message === "502") {
				errormsg("Service temporarily unavailable", "single-t-modal-errormsg");
			}
			else if (e.message === "401" || e.message === "403") {
				updateProfile(false, null);
				errormsg('You were redirected to the landing page', 'homepage-errormsg');
			}
			else {
				errormsg(e.message, 'single-t-modal-errormsg');
			}
		}
	}
	else {
		errormsg("This tournament cannot be started, try again later", 'single-t-modal-errormsg');
	}
}

export async function newtournamentremoteEvent(tourn_id) {
	if (tourn_id) {
		try {
			let tournament;
			const t_details = await getTournamentDetails(tourn_id);

			if (t_details.status === 'In Progress') {
				throw new Error("This tournament is already in progress");
			}
			else if (t_details.status === 'Created') {
				tournament = new RemoteTournament(tourn_id, 'Created');
				await tournament.launchTournament_remote();
			}
			const player2_id = tournament.current_match.player_2.user_id;
			const player1_id = tournament.current_match.player_1.user_id;

			const response = await createTournamentGame(player1_id, player2_id, "TOURNAMENT_REMOTE");
			const newGameId = response.game_id;

			tournament.game_id = `${newGameId}`;

			tournament.startNextMatch();
			hideModal('single-t-modal');
		}
		catch (e) {
			if (e.message === "500" || e.message === "502") {
				errormsg("Service temporarily unavailable", "single-t-modal-errormsg");
			}
			else if (e.message === "401" || e.message === "403") {
				hideModal('single-t-modal');
				updateProfile(false, null);
				errormsg('You were redirected to the landing page', 'homepage-errormsg');
			}
			else {
				errormsg(e.message, 'single-t-modal-errormsg');
			}
		}
	}
	else {
		errormsg("This tournament cannot be started, try again later", 'single-t-modal-errormsg');
	}
}