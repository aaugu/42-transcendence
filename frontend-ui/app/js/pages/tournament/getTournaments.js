import { userID } from '../user/updateProfile.js';

export async function getTournaments() {
	const response = await fetch('https://' + window.location.host + '/api/tournament/', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});

	if (!response.ok && ( response.status === 502 || response.status === 500))
		throw new Error(`${response.status}`);

	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error(`${response.status}`);
	}
	if (responseData !== null) {
		return responseData;
	}
}

export async function getTournamentDetails(tournament_id) {
	const response = await fetch('https://' + window.location.host + '/api/tournament/' + tournament_id + '/', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});

	if (!response.ok && ( response.status === 502 || response.status === 500))
		throw new Error(`${response.status}`);

	const responseData = await response.json();
	if (!response.ok) {
		if (response.status == 404)
			throw new Error(`Tournament does not exists or was deleted`);
		if (responseData.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error('GET TOURNAMENT DETAILS FAILED');
	}
	if (responseData !== null) {
		return responseData;
	}
}

export async function getMyTournaments() {
	if (userID === null) {
		throw new Error('401');
	}

	const response = await fetch('https://' + window.location.host + '/api/tournament/' + userID + '/mytournament/admin/', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});

	if (!response.ok && ( response.status === 502 || response.status === 500))
		throw new Error(`${response.status}`);

	const responseData = await response.json();
	if (!response.ok) {
		if (response.status === 403 || response.status === 401)
			throw new Error(`${response.status}`);
		else if (responseData.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error('GET MY TOURNAMENTS FAILED');
	}
	if (responseData !== null) {
		return responseData;
	}
}
