import { userID } from "../user/updateProfile.js"
import { error500 } from "../errorpage/error500.js";

var all_matches = [];

export async function matchHistory (id = null) {
	const user_id = id || userID;
    if (user_id === null) {
        throw new Error('Could not find user ID');
    }

    const response = await fetch('https://localhost:10443/api/pong/get-user-games/' + user_id + '/', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});
	if (!response.ok) {
		if (response.status === 500 || response.status === 502)
			throw new Error(`${response.status}`);
		const data = await response.json();
		if (data.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error(`${response.status}`);
	}
	const responseData = await response.json();
	if (responseData !== null) {
		console.log('USER LOG: GET FRIEND LIST SUCCESSFUL');
		return responseData;
	}
}

export async function matchHistoryList(id = null) {
	var matches_html = '';
	const user_id = id || userID;
    try {
        const matches = await matchHistory(id);
		all_matches = matches;
		console.log("response from get-user-games: ", matches);
		matches.forEach (match => {
			const date = match.created_at.split(' ')[0];
			matches_html += `<li class="list-group-item">
								<span>${date}</span>
								<span>${match.mode}</span>
								<span>${match.winner_id == user_id ? "WON" : "LOST"}</span>
							</li> `
		});
    }
    catch (e) {
        console.log("USER LOG: ", e.message);
		matches_html = error500();
    }
    return matches_html;
}

export  function matchWinsLosses(id = null) {
	const user_id = id || userID;

	const wins = all_matches.filter(match => match.winner_id == user_id).length;
	const losses = all_matches.filter(match => match.winner_id != user_id).length;

	return {wins, losses};
}