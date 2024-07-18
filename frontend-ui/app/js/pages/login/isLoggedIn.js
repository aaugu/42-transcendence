import { errormsg } from "../../dom/errormsg.js"

//need to verify path and backend handling of this
//possible responses: user does not exist, is not logged in, is logged in
export async function isLoggedIn(username, password) {
	if (sessionStorage.getItem('access_token') !== null)
	{
		// errormsg("You are already logged in");
		return true;
	}
	else
		return false;

	// const response = await fetch('https://172.20.0.2/api/login/check-auth/', {
	// 	method: 'GET',
    //     headers: {
    //         'Accept': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         "username": username,
    //         "password": password
    //     }),
	// 	credentials: 'include'
	// });

	// return response.ok;
}