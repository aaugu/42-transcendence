import { urlRoute } from '../../dom/router.js';
import { startGame } from '../game/gameplay/startGame.js';
import { generateMatches } from './match.js';

export async function startLocalTournament() {
    const tourn_id = localStorage.getItem('tourn_id');
    if (tourn_id === null || tourn_id === undefined) {
        console.log("USER LOG: Tournament ID not found");
        // urlRoute('/tournament');
    }
    try {
        const response = await generateMatches(tourn_id, 'POST');
        console.log("matches: ", response);

        //startTournamentView (patch), give tourn_id
        //startMatchView (post), give tourn_id, body: player1, player2
        startGame();
    }
    catch (e) {
        console.error(`USER LOG: ${e.message}`);
        // urlRoute('/tournament');
    }
 
}