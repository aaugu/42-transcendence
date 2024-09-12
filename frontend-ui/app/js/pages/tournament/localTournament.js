import { urlRoute } from '../../dom/router.js';
import { startGame } from '../game/gameplay/startGame.js';
import { generateMatches } from './match.js';
import { startTournament } from './startTournament.js';

export async function startLocalTournament() {
    const tourn_id = localStorage.getItem('tourn_id');
    localStorage.removeItem('tourn_id');
    if (tourn_id === null || tourn_id === undefined) {
        console.log("USER LOG: Tournament ID not found");
        // urlRoute('/tournament');
    }
    try {
        const response = await generateMatches(tourn_id, 'POST');
        console.log("matches: ", response);

        await startTournament(tourn_id);
        //startMatchView (post), give tourn_id, body: player1, player2 from generateMatches
        // await startMatch(tourn_id, response[0].player1, response[0].player2);

        //do this in startGame??
        startGame();


    }
    catch (e) {
        const tournament_name = document.getElementById('single-t-modal-title').innerText;
		console.error(`USER LOG: ERROR STARTING ${tournament_name}: ${e.message}`);
		errormsg(e.message, "single-t-modal-errormsg");
		setTimeout(() => {
			hideModal('single-t-modal');
			document.getElementById('t-start').classList.add('hidden');
		}, 1000);
	}
        // urlRoute('/tournament');

}