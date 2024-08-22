import { getCookie } from "./cookie.js";

export async function getUserInfo() {
    const token = getCookie('csrf_token');
    if (token === null)
        return { success: false, data: "No token" };

	const decodedToken = jwt_decode(token);
	const url = 'https://localhost:10444/api/user/';

	try {
        const response = await fetch(url + decodedToken.user_id + '/', {
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
                    if (typeof(error.detail) === 'string')
                        errormsg(error.detail, "homepage-errormsg");
                    else
                        errormsg(error.detail[0], "homepage-errormsg");
                }
            }
            throw new Error(`HTTP status code ${response.status}`);
        }

        const responseData = await response.json();
        if (responseData !== null) {
            console.log("responseData in getUserInfo: ", JSON.stringify(responseData));
            console.log("User log: GET USER INFO SUCCESSFUL");
            return { success: true, data: responseData };
        } else {
            throw new Error(`No data returned`);
        }
    } catch (e) {
        console.error('User log: GET USER INFO FETCH FAILURE, ' + e);
        return { success: false, data: e.message || "Fetch error" };
    }
}