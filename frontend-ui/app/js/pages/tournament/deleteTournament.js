export async function deleteTournament() {
	const response = await fetch('https://localhost:10444/api/tournament/', {
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