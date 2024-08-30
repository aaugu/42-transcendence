import { errormsg } from "../../dom/errormsg.js";
import { urlRoute } from "../../dom/router.js"
import { userIsConnected } from "../user/updateProfile.js";
import { updateProfile } from "../user/updateProfile.js";

export async function loginProcess() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (userIsConnected === true){
        errormsg("You are already logged in, redirecting to profile page...", "homepage-errormsg");
        console.log("USER LOG: ALREADY LOGGED IN");
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
            credentials: 'include'
        })
        .then(async response => {
            if (!response.ok) {
                const error = await response.json();
                if (error.username) {
                    errormsg(error.username, "homepage-errormsg");
                }
                else if (error.password) {
                    errormsg(error.password, "homepage-errormsg");
                }
                else if (error.detail) {
                    errormsg(error.detail, "homepage-errormsg");
                }
                throw new Error(`HTTP status code ${response.status}`);
            }
            return response.json()
        })
        .then(responseData => {
            if (responseData !== null) {
                if (responseData.detail) {
                    console.log("USER LOG: TWO FACTOR AUTHENTICATION REQUIRED");
                    var twoFAmodal = new bootstrap.Modal(document.getElementById('login-2fa-modal'));
                    twoFAmodal.show();
                }
                else {
                    // console.log("login response: ", JSON.stringify(responseData));
                    updateProfile(nickname, true, responseData.access);
                    console.log("USER LOG: LOGIN SUCCESSFUL");
                    urlRoute("/profile");
                }
            }
        })
        .catch(e => console.error('USER LOG: LOGIN FETCH FAILURE, '+ e));
    }

    await sendLoginDataToAPI(username, password);

}
