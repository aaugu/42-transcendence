import { errormsg } from "../../dom/errormsg.js";
import { urlRoute } from "../../dom/router.js"
import { editUserInfo } from "../user/editUserInfo.js";

export var twoFactorAuth = (localStorage.getItem("twoFactorAuth") === "true");

export async function verifyTwoFactorAuth(twoFactorAuthCode) {
    await fetch('https://localhost:10444/api/login/token/verify-2fa/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
		body: JSON.stringify({
			"verification_code": twoFactorAuthCode,
		}),
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.json();
			if (error.status === 400) {
				if (error.detail) {
					if (typeof(error.detail) == 'string')
						errormsg(error.detail, "homepage-errormsg");
					else
						errormsg(error.detail[0], "homepage-errormsg");
				}
			}
            throw new Error(`HTTP status code ${response.status}`);
        }
        return response.json()
    })
    .then(responseData => {
            if (responseData !== null) {
                console.log(JSON.stringify(responseData));
                console.log("User log: TWO FACTOR AUTHENTICATION SUCCESSFUL");
                return { success: true, data: responseData };
            }
    })
    .catch(e => {
        console.error('User log: TWO FACTOR AUTHENTICATION FETCH FAILURE, '+ e);
        return { success: false, error: e.message || "Fetch error" };
    });
}

export async function twoFactorAuthProfileButton() {
	const twoFAbtn = document.getElementById("2fa-profile-btn");
	if (twoFactorAuth === false) {
		const response = await editUserInfo("is_2fa_enabled", true);
		if (response.success == true) {
			twoFAbtn.innerHTML = "Deactivate";
			twoFAbtn.classList.remove("btn-outline-success");
			twoFAbtn.classList.add("btn-outline-danger");
			twoFAbtn.setAttribute('data-bs-target', '#deactivate-2fa-modal');
			localStorage.setItem('twoFactorAuth', true);
			twoFactorAuth = true;
			console.log("User log: 2FA activation successful");
		}
		else
			errormsg("Unable to change 2FA", "activate2fa-errormsg");
		const activateModal = bootstrap.Modal.getInstance(document.getElementById('activate-2fa-modal'));
		if (activateModal) {
			setTimeout(() => {
				activateModal.hide();
			}, 1000);
		}
	} else {
		const response = await editUserInfo("is_2fa_enabled", false);
		if (response.success == true) {
			twoFAbtn.innerHTML = "Activate";
			twoFAbtn.classList.remove("btn-outline-danger");
			twoFAbtn.classList.add("btn-outline-success");
			twoFAbtn.setAttribute('data-bs-target', '#activate-2fa-modal');
			localStorage.setItem('twoFactorAuth', false);
			twoFactorAuth = false;
			console.log("User log: 2FA de-activation successful");
		}
		else
			errormsg("Unable to change 2FA", "deactivate2fa-errormsg");
		const deactivateModal = bootstrap.Modal.getInstance(document.getElementById('deactivate-2fa-modal'));
		if (deactivateModal) {
			setTimeout(() => {
				deactivateModal.hide();
			}, 1000);
		}
	}
}

export async function twoFactorAuthLoginButton() {
	const input = document.getElementById('2fa-code');
	const twoFaAuthCode = input.value;
	input.value = '';
	if (twoFaAuthCode == '') {
		errormsg('Please enter a code', 'login-twoFA-errormsg');
		return ;
	}
	const response = await verifyTwoFactorAuth(twoFaAuthCode);
	if (response.success == true) {
		localStorage.setItem('token', response.data.access);
		console.log("User log: LOGIN SUCCESSFUL");
		urlRoute('/profile');
	}
	else {
		errormsg("Invalid verification code", 'login-twoFA-errormsg');
	}
}