export async function getTournaments() {
	const response = await fetch('https://localhost:10443/api/tournament/remote/', {
		method: 'GET',
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
		console.log('USER LOG: GET TOURNAMENTS SUCCESSFUL');
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}

export async function getTournamentDetails(tournament_id) {
	const response = await fetch('https://localhost:10443/api/tournament/' + tournament_id + '/', {
		method: 'GET',
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
		throw new Error('GET TOURNAMENT DETAILS FAILED');
	}
	if (responseData !== null) {
		console.log('USER LOG: GET TOURNAMENT DETAILS SUCCESSFUL');
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}
