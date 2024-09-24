import { error500 } from "../errorpage/error500.js";
import { userID } from "../user/updateProfile.js";

let friendListRefreshInterval;

export async function getFriendList(id = null) {
	const user_id = id || userID;
    if (user_id === null) {
        throw new Error('Could not find user ID');
    }

    const response = await fetch('https://localhost:10443/api/user/' + userID + '/friends/status', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});
	if (!response.ok && response.status === 502)
		throw new Error(`${response.status}`);

	const responseData = await response.json(); // ne fonctionne pas en cas d'erreur 500 car la réponse ne peut pas être interprêtée en json, vérif du 500 avant
	if (!response.ok) {
		if (responseData.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error('GET FRIEND LIST FAILED');
	}
	if (responseData !== null) {
		console.log('USER LOG: GET FRIEND LIST SUCCESSFUL');
		return responseData.online_statuses;
	}
}

export async function addFriend(friend_nickname) {
    if (userID === null) {
        throw new Error('Could not find user ID');
    }
	else if (friend_nickname === localStorage.getItem('nickname')) {
		throw new Error('Cannot add yourself to contact list');
	}

    const response = await fetch('https://localhost:10443/api/user/' + userID + '/friends/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
        body: JSON.stringify({"friend_nickname": friend_nickname}),
		credentials: 'include'
	});

	if (!response.ok && response.status === 502)
		throw new Error(`${response.status}`);

	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.details)
			throw new Error(`${responseData.details}`);
		throw new Error('ADD FRIEND FAILED');
	}
	if (responseData !== null) {
		console.log('USER LOG: ADD FRIEND SUCCESSFUL');
	}
}

export async function deleteFriend(friend_id) {
    if (userID === null || friend_id === null) {
        throw new Error('Could not find user ID');
    }

    const response = await fetch('https://localhost:10443/api/user/' + userID + '/friends/delete/' + friend_id + '/', {
		method: 'DELETE',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
        body: JSON.stringify({"friend_id": friend_id}),
		credentials: 'include'
	});

	if (!response.ok && response.status === 502)
		throw new Error(`${response.status}`);

	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.details)
			throw new Error(`${responseData.details}`);
		throw new Error('DELETE FRIEND FAILED');
	}
	if (responseData !== null) {
		console.log('USER LOG: DELETE FRIEND SUCCESSFUL');
	}

}

export async function updateFriendList(id = null) {
    var friends_html = '';
    try {
        const friends = await getFriendList(id);
		if (id) {
			friends.forEach (friend => {
				friends_html += `
				<li class="list-group-item">
					<span>${friend.nickname}</span>
					<div class="align-content-end">
						<span class="status-dot ${friend.online ? 'bg-success' : 'bg-danger'} rounded-circle"></span>
					</div>
				</li>
				`;
			});
		} else {
			friends.forEach (friend => {
				friends_html += `
				<li class="list-group-item">
					<span>${friend.nickname}</span>
					<div class="align-content-end">
						<button id="unfriend-btn" data-friendid="${friend.id}" class="btn btn-outline-danger btn-sm" style="font-size: 10px;">unfriend</button>
						<span class="status-dot ${friend.online ? 'bg-success' : 'bg-danger'} rounded-circle"></span>
					</div>
				</li>
				`;
			});
		}
    }
    catch (e) {
		clearFriendListRefresh();
        console.log("USER LOG: ", e.message);
		friends_html = error500();
    }
    return friends_html;
}

export async function startFriendListRefresh() {
    if (!friendListRefreshInterval) {
        friendListRefreshInterval = setInterval(async () => {
            try {
                const friendList = document.getElementById('friend-list');
                const friends_html = await updateFriendList();
                friendList.innerHTML = friends_html;
            } catch (e) { // On ne rentre jamais ici car même en cas d'erreur d'updateFriendList() on renvoie une valeur à utiliser, ce try/catch pourrait être supprimé
                console.log("USER LOG: Failed to refresh friend list:", e.message);
            }
        }, 15000);
    }
}

export function clearFriendListRefresh() {
    if (friendListRefreshInterval) {
        clearInterval(friendListRefreshInterval);
        friendListRefreshInterval = null;
    }
}