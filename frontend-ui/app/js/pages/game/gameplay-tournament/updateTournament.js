import { Tournament } from './tournamentClass.js';
import { errormsg } from '../../../dom/errormsg.js';
import { createTournamentGame } from '../gameplay/createnewGame.js';
import { urlRoute } from '../../../dom/router.js';
import { hideModal } from '../../../dom/modal.js';

export function updateTournamentTable(matches) {
	const tourn_table = document.getElementById('tournament-table-body');
	tourn_table.innerHTML = '';
	var match_html = '';

	matches.forEach(match => {
		if (match.status !== 'Finished') {
			console.log("Match: ", match);

			var player2;
			if (match.player_2)
				player2 = match.player_2;
			else
				player2 = { nickname: 'TBD' };
			match_html += `
				<tr>
					<th scope="row">${match.id}</th>
					<td>${match.player_1 ? match.player_1.nickname : "TBD"}</td>
					<td>${player2.nickname}</td>
					<td>${match.status}</td>
				</tr>
			`;
		}
	});
	tourn_table.innerHTML = match_html;
}

export async function newMatchCycle(tournament) {
	try {
		localStorage.setItem('tourn_id', tournament.tourn_id);

		const player1_id = tournament.current_match.player_1.user_id;
		const player2_id = tournament.current_match.player_2.user_id;
		const response = await createTournamentGame(player1_id, player2_id);
		const newGameId = response.game_id;
		const new_url = `/tournament/${newGameId}`;
		console.log("new match ID: " + newGameId);
		hideModal('t-match-modal');
		urlRoute(new_url);
	}
	catch (e) {
		errormsg(e.message, 't-match-modal-errormsg');
		urlRoute('/tournament-creation');
	}
}