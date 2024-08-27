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
        } else {
            throw new Error('No response from server');
        }
	}
	catch (e){
		console.log(`User log: CREATE TOURNAMENT ${new_tournament.name} FAILED, STATUS: ${e.message}`);
		throw new Error('Create tournament failed, try again later');
	}
}