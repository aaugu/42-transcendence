export async function joinTournament(tournamentName) {
	try {
        const url = 'https://localhost:10444/api/tournament/create';

		const response = await fetch(url + tournamentName, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
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
            console.log(`User log: GET TOURNAMENT ${tournamentName} SUCCESSFUL`);
            return { success: true, data: responseData };
        } else {
            throw new Error('Empty response');
        }
	}
	catch (e){
		// errormsg(e.value, "t-modal-errormsg");
		console.log(`User log: GET TOURNAMENT ${tournamentName} FAILED, STATUS: ${e.value}`);
		return { success: false, data: e.value };
	}
}