import { userID } from '../user/updateProfile.js';

export async function getTournaments() {
	const response = await fetch('https://localhost:10443/api/tournament/', {
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
	}
}

export async function getMyTournaments() {
	if (userID === null) {
		throw new Error('403');
	}

	const response = await fetch('https://localhost:10443/api/tournament/' + userID + '/mytournament/admin/', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});
	const responseData = await response.json();
	if (!response.ok) {
		if (response.status === 403)
			throw new Error(`${response.status}`);
		else if (responseData.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error('GET MY TOURNAMENTS FAILED');
	}
	if (responseData !== null) {
		console.log('USER LOG: GET MY TOURNAMENTS SUCCESSFUL');
		return responseData;
	}
}
