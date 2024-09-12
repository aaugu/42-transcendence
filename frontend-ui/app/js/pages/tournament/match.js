export async function generateMatches(tournament_id, fetch_method) {
    if (fetch_method === undefined || (fetch_method !== 'GET' && fetch_method !== 'POST')) {
        throw new Error('Invalid fetch method');
    }

	const url = 'https://localhost:10444/api/tournament/' + tournament_id + '/matches/generate/';
	const response = await fetch(url, {
		method: fetch_method,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});
	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error(`${response.status}`);
	}
	if (responseData !== null) {
		console.log('USER LOG: CHANGE TOURNAMENT STATUS SUCCESSFUL');
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}

//startMatch
export async function startMatch(tournament_id, player1, player2) {
    if (tournament_id === undefined || player1 === undefined || player2 === undefined) {
        throw new Error('Invalid parameters to start match');
    }

    const url = 'https://localhost:10444/api/tournament/' + tournament_id + '/match/start/';
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
        body: JSON.stringify({
            "player1": player1,
            "player2": player2
        }),
		credentials: 'include'
	});
	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error(`${response.status}`);
	}
	if (responseData !== null) {
		console.log('USER LOG: START TOURNAMENT SUCCESSFUL');
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}

//endMatch

