export async function getTournaments() {
	const response = await fetch('https://localhost:10444/api/tournament/remote/', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});
	if (!response.ok) {
		if (response.errors)
			throw new Error(`${response.errors}`);
		throw new Error(`${response.status}`);
	}
	const responseData = await response.json();
	if (responseData !== null) {
		console.log(`USER LOG: ${responseData.message}`);
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}

export async function getTournamentDetails(tournament_id) {
	const response = await fetch('https://localhost:10444/api/tournament/' + tournament_id + '/', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});
	if (!response.ok) {
		if (response.errors)
			throw new Error(`${response.errors}`);
		throw new Error('GET TOURNAMENT DETAILS FAILED');
	}
	const responseData = await response.json();
	if (responseData !== null) {
		console.log(`USER LOG: ${responseData.message}`);
		return responseData;
	} else {
		throw new Error('No response from server');
	}
	// return {
	// 	"name": "first tournament",
	// 	"id": 1,
	// 	"players" : {
	// 		"player1": {
	// 			"user-id": 1,
	// 			"nickname": "player1"
	// 		},
	// 		"player2": {
	// 			"user-id": 2,
	// 			"nickname": "player2"
	// 		}
	// 	}
	// }
}
