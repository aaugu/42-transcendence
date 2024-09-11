import { get_all_tournaments, all_tournaments } from './tournament.js';
import { getMyTournaments } from './getTournaments.js';

export async function updateTournLists() {
    var html_tournaments = '';

	await get_all_tournaments();
    if (Object.keys(all_tournaments).length !== 0) {
        all_tournaments.forEach(tournament => {
            html_tournaments += `
                <li class="list-group-item">
                    <span data-tournid="${tournament.id}">${tournament.name}</span>
                </li>`;
        });
    }
    
    const tourn_list = document.getElementById('tournament-list');
    tourn_list.innerHTML = html_tournaments;

    try {
        var html_my_tournaments = '';
        
        const response = await getMyTournaments();
        const my_tournaments = response['active-tournaments'];
        if (Object.keys(my_tournaments).length !== 0) {
            my_tournaments.forEach(tournament => {
                html_my_tournaments += `
                <li class="list-group-item">
                    <span data-tournid="${tournament.id}">${tournament.name}</span>
                </li>`;
            });
        }
        const my_tourn_list = document.getElementById('my-tournament-list');
        my_tourn_list.innerHTML = html_my_tournaments;
    }
    catch (e) {
        console.error('USER LOG: ', e.message);
        html_my_tournaments = '';
    }
}
