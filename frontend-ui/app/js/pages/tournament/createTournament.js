import { errormsg } from '../../dom/errormsg.js';
import { urlRoute } from '../../dom/router.js';

export async function createTournament(new_tournament, mode) {
	try {
		const response = await fetch('https://localhost:10444/api/tournament/' + mode + '/', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"name": new_tournament.name,
				"user_id": new_tournament.user_id,
				"max_players": new_tournament.max_players,
				"player_names": new_tournament.player_names,
				"is_private": new_tournament.is_private,
				"password": new_tournament.password
			}),
			credentials: 'include'
		});
		if (!response.ok) {
            // const error = await response.json();
			// if (response.status === 400) {
			// 	//check correct error codes
			// 	errormsg("Internal error, try again later", "t-modal-errormsg");
			// }
			throw new Error(`${response.status}`);
        }
		const responseData = await response.json();
        if (responseData !== null) {
            console.log("User log: TOURNAMENT CREATION SUCCESSFUL");
			// if (mode === 'local') {
			// 	//directly go to tournament game page
			// 	urlRoute('/tournament/game');
			// }
            return { success: true, data: responseData };
        } else {
            throw new Error('Empty response');
        }
	}
	catch (e){
		// errormsg(e.value, "t-modal-errormsg");
		console.log(`User log: CREATE TOURNAMENT ${new_tournament.name} FAILED, STATUS: ${e.value}`);
		return { success: false, data: e.value };
	}
}