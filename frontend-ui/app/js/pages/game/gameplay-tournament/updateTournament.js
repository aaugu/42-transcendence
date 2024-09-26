import { Tournament } from './tournamentClass.js';
import { errormsg } from '../../../dom/errormsg.js';
import { createTournamentGame } from '../gameplay/createnewGame.js';
import { urlRoute } from '../../../dom/router.js';
import { hideModal } from '../../../dom/modal.js';
import { joinGame } from '../remote/joinGameandRedirect.js';
import { getGameID } from '../gameplay/createnewGame.js';

export function updateTournamentTable(matches) {
	const tourn_table = document.getElementById('tournament-table-body');
	tourn_table.innerHTML = '';
	var match_html = '';

	matches.forEach(match => {
		if (match.status !== 'Finished') {
			console.log("Match: ", match);

			match_html += `
				<tr>
					<th scope="row">${match.id}</th>
					<td>${match.player_1 ? match.player_1.nickname : "TBD"}</td>
					<td>${match.player_2 ? match.player_2.nickname : "TBD"}</td>
					<td>${match.status}</td>
				</tr>
			`;
		}
	});
	tourn_table.innerHTML = match_html;
}

export async function newMatchCycle(tournament) {
	localStorage.setItem('tourn_id', tournament.tourn_id);

	const player1_id = tournament.current_match.player_1.user_id;
	const player2_id = tournament.current_match.player_2.user_id;
	const response = await createTournamentGame(player1_id, player2_id);
	const newGameId = response.game_id;
	const new_url = `/tournament/${newGameId}`;
	hideModal('t-match-modal');
	urlRoute(new_url);
}

export async function newMatchCycle_remote(tournament) {
	// try {
		const newGameId = await getGameID("tournament-remote");
		const new_url = `/tournament-remote/${newGameId}`;

		tournament.notif_link = `<button id="t-remote-match-link" data-gameurl="${new_url}" data-tournid="${tournament.tourn_id}"
										class="btn btn-primary" href='#'>Join the match</button>`;
		tournament.startNextMatch();
		if (current_match) {
			const player2_id = tournament.current_match.player_2.user_id;
			await joinGame(newGameId, player2_id);
		}
	// } catch (e) {
	// 	if (e.message === "500" || e.message === "502" || e.message === "403") {
	// 		throw new Error(e.message);
	// 	}
	// }


}