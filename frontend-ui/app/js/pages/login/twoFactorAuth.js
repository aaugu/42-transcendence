import { errormsg } from "../../dom/errormsg.js";
import { urlRoute } from "../../dom/router.js"
import { editUserInfo } from "../user/editUserInfo.js";
import { updateProfile } from "../user/updateProfile.js";
import { hideModal } from "../../dom/modal.js";

export async function verifyTwoFactorAuth(twoFactorAuthCode) {
	const response = await fetch('https://' + window.location.host + '/api/login/token/verify-2fa/', {
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

	if (!response.ok && ( response.status === 502))
		throw new Error(`${response.status}`);

	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.detail)
		    throw new Error(`${responseData.detail}`);
		throw new Error(`${response.status}`);
	}

	if (responseData !== null) {
		return responseData;
	}
}

export async function twoFactorAuthProfileButton(user_2fa_enabled) {
	const twoFAbtn = document.getElementById("2fa-profile-btn");
	if (user_2fa_enabled === false) {
		try {
			await editUserInfo("is_2fa_enabled", true);
			twoFAbtn.innerHTML = "Deactivate";
			twoFAbtn.classList.remove("btn-outline-success");
			twoFAbtn.classList.add("btn-outline-danger");
			twoFAbtn.setAttribute('data-bs-target', '#deactivate-2fa-modal');
			updateProfile(false, null);
			hideModal('activate-2fa-modal');
			urlRoute('/');
		}
		catch (e) {
			if (e.message === "502")
				errormsg("Service temporarily unavailable", "activate2fa-errormsg");
			else
				errormsg("Unable to change 2FA", "activate2fa-errormsg");
		}
		hideModal('activate-2fa-modal');

	} else {
		try {
			await editUserInfo("is_2fa_enabled", false);
			twoFAbtn.innerHTML = "Activate";
			twoFAbtn.classList.remove("btn-outline-danger");
			twoFAbtn.classList.add("btn-outline-success");
			twoFAbtn.setAttribute('data-bs-target', '#activate-2fa-modal');
		}
		catch (e) {
			if (e.message === "502")
				errormsg("Service temporarily unavailable", "deactivate2fa-errormsg");
			else
				errormsg("Unable to change 2FA", "deactivate2fa-errormsg");
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
		const response = await verifyTwoFactorAuth(twoFaAuthCode);

		hideModal('login-2fa-modal');
		updateProfile(true, response.access);
		urlRoute('/profile');
	}
	catch (e) {
		if (e.message === "502") {
			errormsg('Service temporarily unavailable', 'login-twoFA-errormsg');
		} else {
			errormsg('Invalid verification code', 'login-twoFA-errormsg');
		}
	}
}
