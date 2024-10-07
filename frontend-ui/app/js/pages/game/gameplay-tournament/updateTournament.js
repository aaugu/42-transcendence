import { createTournamentGame } from '../gameplay/createnewGame.js';
import { urlRoute } from '../../../dom/router.js';
import { hideModal } from '../../../dom/modal.js';

export function updateTournamentTable(matches) {
	const tourn_table = document.getElementById('tournament-table-body');
	tourn_table.innerHTML = '';
	var match_html = '';

	matches.forEach(match => {
		if (match.status !== 'Finished') {
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

export async function startNewMatchCycle(tournament) {
	localStorage.setItem('tourn_id', tournament.tourn_id);

	const player1_id = tournament.current_match.player_1.user_id;
	const player2_id = tournament.current_match.player_2.user_id;
	const response = await createTournamentGame(player1_id, player2_id, "TOURNAMENT");
	const newGameId = response.game_id;
	const new_url = `/tournament/${newGameId}`;
	hideModal('match-modal');
	urlRoute(new_url);
}

export async function startNewMatchCycle_remote(tournament) {
	const player1_id = tournament.current_match.player_1.user_id;
	const player2_id = tournament.current_match.player_2.user_id;
	const response = await createTournamentGame(player1_id, player2_id, "TOURNAMENT_REMOTE");
	const newGameId = response.game_id;
	// const new_url = `/tournament-remote/${newGameId}`;

	tournament.game_id = `${newGameId}`;
	tournament.startMatch();
}