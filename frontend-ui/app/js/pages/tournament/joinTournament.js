import { errormsg } from '../../dom/errormsg.js';

export async function joinTournament(tournamentName, username) {
	try {
		const response = await fetch('https://localhost:10444/api/tournament/create', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				tournamentName: tournamentName,
				username: username,
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
            console.log(`User log: ${username} JOINED TOURNAMENT ${tournamentName}`);
            return { success: true, data: responseData };
        } else {
            throw new Error('Empty response');
        }
	}
	catch (e){
		// errormsg(e.value, "t-modal-errormsg");
		console.log(`User log: ${username} COULD NOT JOIN TOURNAMENT ${tournamentName}, STATUS: ${e.value}`);
		return { success: false, data: e.value };
	}
}