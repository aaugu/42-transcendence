import { get_all_tournaments, all_tournaments } from './tournament.js';

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

    // try {
    //     var html_my_tournaments = '';
    //     //
    // catch (e) {

    // }
}
