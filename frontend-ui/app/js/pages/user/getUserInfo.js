import { userID } from "./updateProfile.js";

export async function getUserInfo() {
    console.log("get UserInfo userID: ", userID);
    if (userID === null)
        throw new Error ("Could not identify user");
	const url = 'https://localhost:10444/api/user/';

	try {
        const response = await fetch(url + userID + '/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            if (response.status === 401 || response.status === 404) {
                if (error.detail) {
                    throw new Error (error.detail);
                }
            }
            throw new Error('Could not get user info');
        }

        const responseData = await response.json();
        if (responseData !== null) {
            console.log("USER LOG: GET USER INFO SUCCESSFUL");
            return responseData;
        } else {
            throw new Error('No response from server');
        }
    } catch (e) {
        console.error('USER LOG: GET USER INFO FETCH FAILURE, ' + e.message);
        throw new Error(e.message);
    }
}