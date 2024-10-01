import { errormsg } from "../../dom/errormsg.js";
import { urlRoute } from "../../dom/router.js"
import { userID } from "../user/updateProfile.js";
import { updateProfile } from "../user/updateProfile.js";
import { setUserID } from "../user/updateProfile.js";
import { defaultAvatar } from "../user/avatar.js";
import { logout } from "../user/logout.js";

export async function loginProcess() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!password || !username) {
        errormsg("Username or password field cannot be blank", "homepage-errormsg");
        return ;
    }

    const loginBtn = document.getElementById('login-submit')
    if (loginBtn)
        loginBtn.disabled = true;

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

    const sendLoginDataToAPI = async (username, password) => {
        await fetch('https://' + window.location.host + '/api/login/token/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
            credentials: 'include'
        })
        .then(async response => {
            if (!response.ok) {
                if ( response.status === 502)
                    throw new Error(`${response.status}`);
                const error = await response.json();
                if (error.username) {
                    errormsg(error.username, "homepage-errormsg");
                    if (loginBtn)
                        loginBtn.disabled = false;
                }
                else if (error.password) {
                    errormsg(error.password, "homepage-errormsg");
                    if (loginBtn)
                        loginBtn.disabled = false;
                }
                else if (error.detail) {
                    errormsg(error.detail + ", are your username and password correct?", "homepage-errormsg");
                    if (loginBtn)
                        loginBtn.disabled = false;
                }
                throw new Error(`HTTP status code ${response.status}`);
            }
            return response.json()
        })
        .then(responseData => {
            if (responseData !== null) {
                if (responseData.detail) {
                    var twoFAmodal = new bootstrap.Modal(document.getElementById('login-2fa-modal'));
                    twoFAmodal.show();
                    if (loginBtn)
                        loginBtn.disabled = false;
                }
                else {
                    updateProfile(true, responseData.access);
                    urlRoute("/profile");
                }
            }
        })
        .catch(e => {
            if (e.message === "502") {
                errormsg("Service temporarily unavailable", "login-errormsg");
                const loginBtn = document.getElementById('login-submit').disabled = false;
                return;
            }
        });
    }

    await sendLoginDataToAPI(username, password);
}
