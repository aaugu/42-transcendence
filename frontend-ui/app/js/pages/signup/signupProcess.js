import { urlRoute } from "../../dom/router.js"
import { errormsg } from "../../dom/errormsg.js"
import { updateProfile } from "../user/updateProfile.js"
import { defaultAvatar } from "../user/updateProfile.js";
import { signupFieldsValidity } from "./signupFieldsValidity.js";
import { userIsConnected } from "../user/updateProfile.js";
import { readAvatarFile } from "../user/avatar.js";
import { loginProcess } from "../login/loginProcess.js";

export async function signupProcess() {
    const userData = document.getElementsByClassName('form-control');
    const username = userData[0].value;
    const nickname = userData[1].value;
    const email = userData[2].value;
    const password = userData[3].value;
    const repeatPassword = userData[4].value;
    var avatar;

    if (userIsConnected === true){
        errormsg("Please log out first before signing up as a new user...", "homepage-errormsg");
        console.log("User log: ALREADY LOGGED IN");
        setTimeout(() => {
            urlRoute("/profile");
        }, 3000);
        return;
    }

    if (!signupFieldsValidity(username, nickname, email, password, repeatPassword)) {
        console.log("User log: SIGNUP FAILED");
        return;
    }

    if (document.getElementById('uploadAvatar').checked) {
        var avatarFile = document.getElementById('avatarUpload').files[0];
        try {
            avatar = await readAvatarFile(avatarFile);
        } catch (error) {
            console.error("User log: Error reading avatar file,", error);
            avatar = defaultAvatar;
        }
    }
    else
        avatar = defaultAvatar;

    var userdata = {
        "username": username,
        "nickname": nickname,
        "email": email,
        "password": password,
        "avatar": avatar
    };

    const sendSignupDataToAPI = async (userdata) => {
        await fetch('https://localhost:10444/api/user/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userdata),
                // credentials: 'include' //include cookies
        })
        .then(async response => {
                if (!response.ok) {
                    if (response.status == 400) {
                        const error = await response.json();
                        if (error.username) {
                            if (typeof(error.username) == 'string')
                                errormsg(error.username, "homepage-errormsg");
                            else
                                errormsg(error.username[0], "homepage-errormsg");
                        }
                        else if (error.email) {
                            if (typeof(error.email) == 'string')
                                errormsg(error.email), "homepage-errormsg";
                            else
                                errormsg(error.email[0], "homepage-errormsg");
                        }
                        // else if (error.password) {
                        // 	if (typeof(error.password) == 'string')
                        // 		errormsg(error.password, "homepage-errormsg");
                        // 	else
                        // 		errormsg(error.password[0], "homepage-errormsg");
                        // }
                    }
                    throw new Error(`HTTP status code ${response.status}`);
                }
                return response.json();
        })
        .then(responseData => {
                if (responseData !== null) {
                    console.log("User log: SIGNUP SUCCESSFUL, LOGGING IN...");
                    loginProcess();
                }
        })
        .catch(e => console.error('User log: SIGNUP FETCH FAILURE, '+ e));
    }

	await sendSignupDataToAPI(userdata);

	// const getCookie = (name) => {
	// 	const value = "; " + document.cookie;
	// 	const parts = value.split("; " + name + "=");
	// 	if (parts.length === 2)
	// 		return parts.pop().split(";").shift();
	// 	else
	// 		return null;
	// }
    // const csrf_token = getCookie('csrftoken');
	// if (csrf_token !== null)
    // 	console.log("csrf_token: ", csrf_token);
	// else
	// 	console.log("csrf_token is null");
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
