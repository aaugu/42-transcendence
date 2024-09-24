import { get_all_tournaments, all_tournaments } from './tournament.js';
import { getMyTournaments } from './getTournaments.js';
import { updateProfile } from '../user/updateProfile.js';
import { errormsg } from '../../dom/errormsg.js';
import { error500 } from '../errorpage/error500.js';

export async function updateTournLists() {  
    try {
        var html_tournaments = '';
    
        await get_all_tournaments();
        document.getElementById("tournament-page").classList.remove("d-none");
        if (Object.keys(all_tournaments).length !== 0) {
            all_tournaments.forEach(tournament => {
                html_tournaments += `
                    <li class="list-group-item">
                        <span data-tournid="${tournament.id}">${tournament.name}</span>
                    </li>`;
            });
        }
    
        const tourn_list = document.getElementById('tournament-list');
        if (tourn_list)
            tourn_list.innerHTML = html_tournaments;
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
        if (my_tourn_list)
            my_tourn_list.innerHTML = html_my_tournaments;
    }
    catch (e) {
        if (e.message === "500" || e.message === "502") {
            document.getElementById('main-content').innerHTML = error500();
            return ;
        }
        if (e.message === "403") {
            updateProfile(false, null);
            errormsg('You were redirected to the landing page', 'homepage-errormsg');
            return ;
        }
        console.error('USER LOG: ', e.message);
    }
}
