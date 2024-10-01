import { userID } from "../user/updateProfile.js"
import { error500 } from "../errorpage/error500.js";

var all_matches = [];

export async function matchHistory (id = null) {
	const user_id = id || userID;
    if (user_id === null) {
        throw new Error('Could not find user ID');
    }

    const response = await fetch('https://' + window.location.host + '/api/pong/get-user-games/' + user_id + '/', {
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
		return responseData;
	}
}

export async function matchHistoryList(nickname, id) {
	var matches_html = '';
    try {
        const matches = await matchHistory(id);
		all_matches = matches;
		matches.forEach (match => {
			const date = match.created_at.split(' ')[0];
			matches_html += `
			<tr>
					<th scope="row">${date}</th>
					<td>${match.winner_id == nickname ? match.loser_id : match.winner_id}</td>
					<td>${match.mode == "LOCAL_TWO_PLAYERS" ? "LOCAL" : match.mode}</td>
					<td>${match.winner_id == nickname ? "WON" : "LOST"}</td>
				</tr>`
		});
    }
    catch (e) {
		matches_html = error500();
    }
    return matches_html;
}

export  function matchWinsLosses(nickname) {
	const wins = all_matches.filter(match => match.winner_id == nickname).length;
	const losses = all_matches.filter(match => match.winner_id != nickname).length;

	return {wins, losses};
}
