import { userID } from "./updateProfile.js";

export async function getUserInfo(id = null) {
    const user_id = id || userID;
    if (user_id === null)
        throw new Error ("401");
	const url = 'https://' + window.location.host + '/api/user/';

    const response = await fetch(url + user_id + '/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        if (response.status === 502 || response.status === 500) {
            throw new Error(`${response.status}`)
        }
        const error = await response.json();
        if (response.status === 401 || response.status === 404) {
            if (error.detail) {
                throw new Error (error.detail);
            }
        }
        if (response.status === 403)
            throw new Error(`${response.status}`)
        throw new Error('Could not get user info');
    }

    const responseData = await response.json();
    if (responseData !== null) {
        return responseData;
    }
}

export async function getNicknameUserInfo(nickname) {
    if (nickname === null || nickname === "")
        throw new Error ("401");
	const url = 'https://' + window.location.host + '/api/user/getuser/nickname/';

    const response = await fetch(url + nickname, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`${response.status}`)
    }

    const responseData = await response.json();
    if (responseData !== null) {
        return responseData;
    }
}