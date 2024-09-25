import { getGameID, createTournamentGame } from './gameplay/createnewGame.js'
import { urlRoute } from '../../dom/router.js';
import { hideModal } from '../../dom/modal.js';
import { errormsg } from '../../dom/errormsg.js';
import { Tournament } from './gameplay-tournament/tournamentClass.js';
import { getTournamentDetails } from '../tournament/getTournaments.js';

export async function newlocalgameEvent(e) {
	const newGameId = await getGameID();
	if (newGameId) {
		const new_url = `/local-twoplayer/${newGameId}`;
		urlRoute(new_url);
	}
}

export async function newAIgameEvent(e) {
	const newGameId = await getGameID();
	if (newGameId) {
		const new_url = `/local-ai/${newGameId}`;
		urlRoute(new_url);
	}
}

export async function newremotegameEvent(e) {
	const newGameId = await getGameID();
	const new_url = `/remote-twoplayer/${newGameId}`;

	urlRoute(new_url);
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
			const response = await createTournamentGame(player1_id, player2_id);
			const newGameId = response.game_id;
			const new_url = `/tournament/${newGameId}`;
			hideModal('single-t-modal');
			urlRoute(new_url);
		}
		catch (e) {
			if (e.message === "500" || e.message === "502") {
				errormsg("Service temporarily unavailable", "single-t-modal-errormsg");

			} else if (e.message === "403") {
				updateProfile(false, null);
				errormsg('You were redirected to the landing page', 'homepage-errormsg');
			}
			else {
				errormsg("This tournament cannot be started, try again later", 'single-t-modal');
			}
		}
	}
	errormsg("This tournament cannot be started, try again later", 'single-t-modal');
}