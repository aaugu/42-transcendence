import { urlRoute } from '../../dom/router.js';
import { playTournament } from '../game/gameplay/playTournament.js';
import { generateMatches } from './match.js';
import { startTournament } from './startTournament.js';

export async function startLocalTournament() {

        // urlRoute('/tournament');
        playTournament();
        // urlRoute('/tournament');

}