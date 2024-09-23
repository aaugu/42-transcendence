import { userID } from "./updateProfile.js";

export async function getUserInfo() {
    if (userID === null)
        throw new Error ("403");
	const url = 'https://localhost:10443/api/user/';

    const response = await fetch(url + userID + '/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        if (response.status === 502) {
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
        console.log("USER LOG: GET USER INFO SUCCESSFUL");
        return responseData;
    } else {
        throw new Error('No response from server');
    }
}