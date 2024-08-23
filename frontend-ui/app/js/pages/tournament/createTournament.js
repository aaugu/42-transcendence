export async function createTournament(tournamentName, username, playerNr, playerNames) {
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
				playerNr: playerNr,
				playerNames: playerNames
			}),
			credentials: 'include'
		});
		if (!response.ok) {
            // const error = await response.json();
			// if (response.status === 400) {
			// 	//check correct error codes
			// 	errormsg("Internal error, try again later", "t-modal-errormsg");
			// }
			console.log(`User log: TOURNAMENT RESPONSE STATUS ${response.status}`);
            throw new Error('Could not be created');
        }
		const responseData = await response.json();
        if (responseData !== null) {
            console.log("User log: TOURNAMENT CREATION SUCCESSFUL");
            return { success: true, data: responseData };
        } else {
            throw new Error('Empty response');
        }
	}
	catch (e){
		errormsg(e.value, "t-modal-errormsg");
	}
}