import { urlRoute } from "../../dom/router.js"
import { errormsg } from "../../dom/errormsg.js"
import { updateProfile } from "../user/user.js"

function signUpFieldsValidity(username, nickname, email, password, repeatPassword)
{
    if (username == '' || nickname == '' || email == '' || password == '' || repeatPassword == '') {
        errormsg("All fields must be filled out");
        return false;
    }
    else if (password !== repeatPassword) {
        errormsg("The passwords don't match");
        return false;
    }
    const passwordValidity = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8 && password.length <= 25;

        return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && isLongEnough;
    }
    if (passwordValidity(password) == false) {
        errormsg("Your password must be 8 - 25 characters long and include at least 1 special, 1 uppercase and 1 digit");
		return false;
    }
	return true;
}

export async function signupProcess() {
    const userData = document.getElementsByClassName('form-control');
    const username = userData[0].value;
    const nickname = userData[1].value;
    const email = userData[2].value;
    const password = userData[3].value;
    const repeatPassword = userData[4].value;

    if (!signUpFieldsValidity(username, nickname, email, password, repeatPassword)) {

        return;
    }

    const sendUserDataToAPI = async (username, nickname, email, password) => {
        await fetch('https://localhost:10444/api/user/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "nickname": nickname,
                "email": email,
                "password": password
            }),
                // credentials: 'include' //include cookies
        })
        .then(async response => {
                if (!response.ok) {
					if (response.status == 400) {
						const error = await response.json();
						if (error.username) {
							if (typeof(error.username) == 'string')
								errormsg(error.username);
							else
								errormsg(error.username[0]);
						}
						else if (error.email) {
							if (typeof(error.email) == 'string')
								errormsg(error.email);
							else
								errormsg(error.email[0]);
						}
						// else if (error.password) {
						// 	if (typeof(error.password) == 'string')
						// 		errormsg(error.password);
						// 	else
						// 		errormsg(error.password[0]);
						// }
						return null;
					}
					throw new Error(`HTTP status code ${response.status}`);
				}
					return response.json();
        })
        .then(responseData => {
                if (responseData !== null) {
                    // set access token in httponly cookies
                    // sessionStorage.setItem('access_token', username);
					updateProfile(username, true, responseData.token);
                    console.log(JSON.stringify(responseData))
                    urlRoute("/profile");
                }
        })
        .catch(e => console.error('Fetch error: '+ e));
    }

	await sendUserDataToAPI(username, nickname, email, password);

    // sessionStorage.setItem('access_token', username);

	const getCookie = (name) => {
		const value = "; " + document.cookie;
		const parts = value.split("; " + name + "=");
		if (parts.length === 2)
			return parts.pop().split(";").shift();
		else
			return null;
	}
    const csrf_token = getCookie('csrftoken');
	if (csrf_token !== null)
    	console.log("csrf_token: ", csrf_token);
	else
		console.log("csrf_token is null");


    // check not only username but e-mail address for double users
    // make sure to not be able to go back with browser arrows
    // only one cookie per session?
}


/*
	fetch process:
	try/catch is used to get errors when the promise gets rejected (network or CORS issues)
	response.ok is used to handle server errors (404 or 500, for example) when the promise gets resolved

	JSON format user signup:
    https://172.20.0.2/api/user/
    {
        "username": "",
        "nickname": "",
        "email": "",
        "password": ""
    }
    JSON format 2fa verification:
    https://172.20.0.2/api/token/verify-2fa/
    {
        "verification_code": ""
    }
*/
