import { errormsg } from "../../dom/errormsg.js";
import { urlRoute } from "../../dom/router.js"
import { editUserInfo } from "../user/editUserInfo.js";
import { updateProfile } from "../user/updateProfile.js";
import { hideModal } from "../../dom/modal.js";

export async function verifyTwoFactorAuth(twoFactorAuthCode) {
    try {
        const response = await fetch('https://localhost:10444/api/login/token/verify-2fa/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "verification_code": twoFactorAuthCode,
            }),
			credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            // if (error.status === 400) {
            //     if (error.detail) {
            //         if (typeof(error.detail) === 'string')
            //             errormsg(error.detail, "homepage-errormsg");
            //         else
            //             errormsg(error.detail[0], "homepage-errormsg");
            //     }
            // }
            throw new Error(error.detail);
        }

        const responseData = await response.json();
        if (responseData !== null) {
            console.log(JSON.stringify(responseData));
            console.log("User log: TWO FACTOR AUTHENTICATION SUCCESSFUL");
        } else {
            throw new Error('No response from server');
        }
    } catch (e) {
        console.error('User log: TWO FACTOR AUTHENTICATION FETCH FAILURE, ' + e.message);
        throw new Error(e.message);
    }
}

export async function twoFactorAuthProfileButton(user_2fa_enabled) {
	const twoFAbtn = document.getElementById("2fa-profile-btn");
	if (user_2fa_enabled === false) {
		const response = await editUserInfo("is_2fa_enabled", true);
		if (response.success == true) {
			twoFAbtn.innerHTML = "Deactivate";
			twoFAbtn.classList.remove("btn-outline-success");
			twoFAbtn.classList.add("btn-outline-danger");
			twoFAbtn.setAttribute('data-bs-target', '#deactivate-2fa-modal');
			console.log("User log: 2FA ACTIVATION SUCCESSFUL");
			updateProfile(null, false, null);
			console.log('User log: LOGOUT');
			hideModal('activate-2fa-modal');
			urlRoute('/');
		}
		else {
			errormsg("Unable to change 2FA", "activate2fa-errormsg");
			hideModal('activate-2fa-modal');
		}

	} else {
		try {
			await editUserInfo("is_2fa_enabled", false);
			twoFAbtn.innerHTML = "Activate";
			twoFAbtn.classList.remove("btn-outline-danger");
			twoFAbtn.classList.add("btn-outline-success");
			twoFAbtn.setAttribute('data-bs-target', '#activate-2fa-modal');
			console.log("User log: 2FA DE-ACTIVATION SUCCESSFUL");
		}
		catch (e) {
			errormsg(e.message, "deactivate2fa-errormsg");
			console.log("User log: 2FA DE-ACTIVATION FAILED");
		}
		hideModal('deactivate-2fa-modal');
	}
}

export async function twoFactorAuthLoginButton() {
	const input = document.getElementById('2fa-code');
	const twoFaAuthCode = input.value;
	input.value = '';
	try {
		if (twoFaAuthCode == '') {
			errormsg('Please enter a code', 'login-twoFA-errormsg');
			return ;
		}
		await verifyTwoFactorAuth(twoFaAuthCode);

		localStorage.setItem('token', response.data.access);
		console.log("User log: LOGIN SUCCESSFUL");
		urlRoute('/profile');
	}
	catch (e) {
		errormsg(e.message, 'login-twoFA-errormsg');
	}
}
