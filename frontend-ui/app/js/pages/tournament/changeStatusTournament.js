import { errormsg } from '../../dom/errormsg.js';

//status: "start", "end", "/matches/generate/"
export async function changeStatusTournament(tournament_id, gameStatus) {
	try {
		const url = 'https://localhost:10444/api/tournament/' + tournament_id + '/match/' + gameStatus + '/';
		const response = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: null,
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
            console.log(`User log: TOURNAMENT ${tournamentName} ${gameStatus}`);
            return { success: true, data: responseData };
        } else {
            throw new Error('Empty response');
        }
	}
	catch (e){
		// errormsg(e.value, "t-modal-errormsg");
		console.log(`User log: ERROR TOURNAMENT ${tournamentName} ${gameStatus}, STATUS: ${e.value}`);
		return { success: false, data: e.value };
	}
}