import { userID } from "../user/updateProfile.js";

let friendListRefreshInterval;

export async function getFriendList() {
    if (userID === null) {
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
	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.errors)
			throw new Error(`${responseData.errors}`);
		throw new Error('GET FRIEND LIST FAILED');
	}
	if (responseData !== null) {
		console.log('USER LOG: GET FRIEND LIST SUCCESSFUL');
		return responseData.online_statuses;
	} else {
		throw new Error('No response from server');
	}
}

export async function addFriend(friend_nickname) {
    console.log("in add friend");
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
	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.details)
			throw new Error(`${responseData.details}`);
		throw new Error('ADD FRIEND FAILED');
	}
	if (responseData !== null) {
		console.log('USER LOG: ADD FRIEND SUCCESSFUL');
	} else {
		throw new Error('No response from server');
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
	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.details)
			throw new Error(`${responseData.details}`);
		throw new Error('DELETE FRIEND FAILED');
	}
	if (responseData !== null) {
		console.log('USER LOG: DELETE FRIEND SUCCESSFUL');
	} else {
		throw new Error('No response from server');
	}

}

export async function updateFriendList() {
    var friends_html = '';
    try {
        const friends = await getFriendList();
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
    catch (e) {
        console.log("USER LOG: ", e.message);
        friends_html = '';
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
            } catch (e) {
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