import { urlRoute } from "../../dom/router.js"
import { errormsg } from "../../dom/errormsg.js"
import { updateProfile } from "../user/user.js"
import { defaultAvatar } from "../user/user.js";
import { signupFieldsValidity } from "./signupFieldsValidity.js";

export async function signupProcess() {
    const userData = document.getElementsByClassName('form-control');
    const username = userData[0].value;
    const nickname = userData[1].value;
    const email = userData[2].value;
    const password = userData[3].value;
    const repeatPassword = userData[4].value;
    const avatar = defaultAvatar;

    if (!signupFieldsValidity(username, nickname, email, password, repeatPassword)) {
        console.log("User log: SIGNUP FAILED");
        return;
    }

    if (avatar === '')
        avatar = defaultAvatar;

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
					}
					throw new Error(`HTTP status code ${response.status}`);
				}
				return response.json();
        })
        .then(responseData => {
                if (responseData !== null) {
                    const user = {
                        "username": username,
                        "avatar": avatar,
                    }
					updateProfile(user, true, responseData.token);
                    // console.log(JSON.stringify(responseData));
                    console.log("User log: SIGNUP SUCCESSFUL");
                    urlRoute("/profile");
                }
        })
        .catch(e => console.error('User log: SIGNUP FETCH FAILURE, '+ e));
    }

	await sendUserDataToAPI(username, nickname, email, password);

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
