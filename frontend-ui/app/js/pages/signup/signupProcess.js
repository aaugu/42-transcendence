import { errormsg } from "../../dom/errormsg.js"
import { defaultAvatar } from "../user/avatar.js";
import { signupFieldsValidity } from "./signupFieldsValidity.js";
import { userID } from "../user/updateProfile.js";
import { readAvatarFile } from "../user/avatar.js";
import { loginProcess } from "../login/loginProcess.js";
import { setUserID } from "../user/updateProfile.js";
import { logout } from "../user/logout.js";


export async function signupProcess() {
    const userData = document.getElementsByClassName('form-control');
    const username = userData[0].value;
    const nickname = userData[1].value;
    const email = userData[2].value;
    const password = userData[3].value;
    const repeatPassword = userData[4].value;
    var avatar;

	if (userID !== null){
		try {
			await logout();
		}
		catch (e) {}
		localStorage.setItem('nickname', 'guest');
		localStorage.setItem('avatar', defaultAvatar);
		document.cookie = `csrf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		document.cookie = `csrftoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		document.cookie = `sessionid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		setUserID();
    }

    if (!signupFieldsValidity(username, nickname, email, password, repeatPassword)) {
        return;
    }

    if (document.getElementById('uploadAvatar').checked) {
        var avatarFile = document.getElementById('avatar-upload-file').files[0];
        try {
            avatar = await readAvatarFile(avatarFile);
        } catch (error) {
            errormsg("Field cannot be blank", "signup-errormsg");
            return;
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
        await fetch('https://' + window.location.host + '/api/user/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userdata),
        })
        .then(async response => {
            if (!response.ok) {
                if ( response.status === 502)
                    throw new Error(`${response.status}`);
                const error = await response.json();
                if (error.username) {
                    errormsg(error.username, "homepage-errormsg");
                }
                else if (error.email) {
                    errormsg(error.email, "homepage-errormsg");
                }
                else if (error.nickname) {
                    errormsg(error.nickname, "homepage-errormsg");
                }
                throw new Error(`${response.status}`);
            }
            return response.json();
        })
        .then(responseData => {
            if (responseData !== null) {
                loginProcess();
            }
        })
        .catch(e => {
            if (e.message === "502") {
                errormsg("Service temporarily unavailable", "signup-errormsg");
            } else {
                errormsg(e.message, "signup-errormsg");
            }
        });
    }

	await sendSignupDataToAPI(userdata);
}
