import { urlRoute } from '../../dom/router.js';
import { startTournamentGame } from '../game/gameplay/playTournamentGame.js';
import { generateMatches } from './match.js';
import { startTournament } from './startTournament.js';

export async function startLocalTournament() {

        // urlRoute('/tournament');
        startTournamentGame();
        // urlRoute('/tournament');

}