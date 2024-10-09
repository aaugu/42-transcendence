import { errormsg } from "../../dom/errormsg.js";
import { urlRoute } from "../../dom/router.js"
import { userID } from "../user/updateProfile.js";
import { updateProfile } from "../user/updateProfile.js";
import { setUserID } from "../user/updateProfile.js";
import { defaultAvatar } from "../user/avatar.js";
import { logout } from "../user/logout.js";
import { containsForbiddenCharacters } from "../../dom/preventXSS.js";
import { passwordValidity } from "../user/password.js";
import { hideModal } from "../../dom/modal.js";

export async function loginProcess() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!password || !username) {
        errormsg("Username or password field cannot be blank", "homepage-errormsg");
        return ;
    }

    if (containsForbiddenCharacters(username)) {
        errormsg("Forbidden characters present in user input", "homepage-errormsg");
        return ;
    }
    if (!passwordValidity(password)) {
        errormsg("Invalid password", "homepage-errormsg");
        return ;
    }

    const loginBtn = document.getElementById('login-submit')
    if (loginBtn)
        loginBtn.disabled = true;

    if (userID !== null){
		try {
			await logout();
		}
		catch (e) {
			errormsg("Previous user was not properly logged out", "homepage-errormsg");
		}
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
                    if (loginBtn)
                        loginBtn.disabled = false;
					throw new Error(error.username);
                }
                else if (error.password) {
                    if (loginBtn)
                        loginBtn.disabled = false;
					throw new Error(error.password);
                }
                else if (error.detail) {
					if (loginBtn)
                        loginBtn.disabled = false;
					throw new Error(error.detail + ", are your username and password correct?");
                }
				else
               		throw new Error(`${response.status}`);
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
            const loginBtn = document.getElementById('login-submit')
            if (loginBtn)
                loginBtn.disabled = false;
            var twoFAmodal = document.getElementById('login-2fa-modal');
            if (twoFAmodal.classList.contains('show'))
                hideModal('login-2fa-modal');
            if (e.message === "502") {
                errormsg("Service temporarily unavailable", "login-errormsg");
            } else {
                errormsg(e.message, "homepage-errormsg");
            }

        });
    }

    await sendLoginDataToAPI(username, password);
}
