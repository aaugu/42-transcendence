import { errormsg } from "../../dom/errormsg.js";
import { urlRoute } from "../../dom/router.js"
import { userIsConnected } from "../user/user.js";
import { defaultAvatar } from "../user/user.js";
import { updateProfile } from "../user/user.js";

export async function loginProcess() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (userIsConnected === true){
        errormsg("You are already logged in, redirecting to profile page...");
        console.log("User log: ALREADY LOGGED IN");
        setTimeout(() => {
            urlRoute("/profile");
        }, 3000);
        return;
    }

    const sendLoginDataToAPI = async (username, password) => {
        await fetch('https://localhost:10444/api/login/token/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
        })
        .then(async response => {
                if (!response.ok) {
                    const error = await response.json();
                    if (response.status === 400) {
						if (error.username) {
							if (typeof(error.username) == 'string')
								errormsg(error.username);
							else
								errormsg(error.username[0]);
						}
						else if (error.password) {
							if (typeof(error.password) == 'string')
								errormsg(error.password);
							else
								errormsg(error.password[0]);
						}
                    }
                    else if (response.status === 401) {
                        if (error.detail) {
							if (typeof(error.detail) == 'string')
								errormsg(error.detail);
							else
								errormsg(error.detail[0]);
						}
                    }
                    throw new Error(`HTTP status code ${response.status}`);
                }
                    return response.json()
        })
        .then(responseData => {
                if (responseData !== null) {
                    const user = {
                        "username": username,
                        "avatar": defaultAvatar, //needs to be changed to user avatar
                    }
                    updateProfile(user, true, responseData.access);
                    // console.log(JSON.stringify(responseData));
                    console.log("User log: LOGIN SUCCESSFUL");
                    urlRoute("/profile");
                }
        })
        .catch(e => console.error('User log: LOGIN FETCH FAILURE, '+ e));
    }

    await sendLoginDataToAPI(username, password);

}


/*
    JSON format 2fa verification:
    https://172.20.0.2/api/token/verify-2fa/
    {
        "verification_code": ""
    }
*/
