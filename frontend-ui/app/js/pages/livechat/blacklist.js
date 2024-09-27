import { userID } from "../user/updateProfile.js";

export var contact_blacklisted = false;


export function set_contact_blacklisted(value) {
	contact_blacklisted = value;
}

export function colorBlockButton() {
	const block_button = document.getElementById('chat-block-btn');
	const icon = block_button.querySelector('i');
	if (contact_blacklisted === true) {
        block_button.classList.remove('btn-outline-danger');
        block_button.classList.add('btn-outline-success');
        if (icon) {
            icon.classList.remove('text-danger');
            icon.classList.add('text-success');
			icon.classList.add('bi-check-circle');
			icon.classList.remove('bi-ban');
        }
		block_button.setAttribute('title', 'Unblock user');
    }
	else {
		block_button.classList.add('btn-outline-danger');
        block_button.classList.remove('btn-outline-success');
        if (icon) {
            icon.classList.add('text-danger');
            icon.classList.remove('text-success');
			icon.classList.remove('bi-check-circle');
			icon.classList.add('bi-ban');
        }
		block_button.setAttribute('title', 'Block user');
	}
}

export async function blockUser(target_id) {
    if (target_id === null || target_id === undefined || userID === null ) {
		throw new Error('Did not find userID or target_id invalid');
	}

	const response = await fetch('https://' + window.location.host + '/api/livechat/' + userID + '/blacklist/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"target_id": target_id,
		}),
		credentials: 'include'
	});
	if (!response.ok) {
		if (response.status === 409)
			throw new Error('User already blocked');
		throw new Error(`${response.status}`);
	}
	console.log('USER LOG: BLOCK USER SUCCESSFUL');

}

export async function unblockUser(target_id) {
    if (target_id === null || target_id === undefined || userID === null ) {
		throw new Error('Did not find userID or target_id invalid');
	}

	const response = await fetch('https://' + window.location.host + '/api/livechat/' + userID + '/blacklist/' + target_id, {
		method: 'DELETE',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});
	if (!response.ok) {
		if (response.status === 409)
			throw new Error('User already unblocked');
		throw new Error(`${response.status}`);
	}
	console.log('USER LOG: UNBLOCK USER SUCCESSFUL');
	
}

export async function isBlacklisted(target_id) {
    if (target_id === null || target_id === undefined || userID === null ) {
		throw new Error('Did not find userID or target_id invalid');
	}

	const response = await fetch('https://' + window.location.host + '/api/livechat/' + userID + '/blacklist/' + target_id, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});
	if (!response.ok) {
		if (response.status === 409)
			throw new Error('User already unblocked');
		throw new Error(`${response.status}`);
	}
	const responseData = await response.json();
	if (responseData !== null) {
		console.log('USER LOG: BLACKLIST STATUS : ' + responseData.is_blacklisted);
		return responseData.is_blacklisted;
	}
	
}