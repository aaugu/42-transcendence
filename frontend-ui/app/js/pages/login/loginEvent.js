import { loginProcess } from "./loginProcess.js"
import { twoFactorAuthLoginButton } from './twoFactorAuth.js';

export async function loginEvent(e) {
	switch (e.target.id) {
		case "login-submit":
			loginProcess();
			break;
		case "verify-2fa-code":
			twoFactorAuthLoginButton();
			break;
		default:
			break;
	}

}

export function loginSubmitOnEnter(e) {
	var twoFAmodal = document.getElementById('login-2fa-modal');
	if (e.key === 'Enter' && !twoFAmodal.classList.contains('show')) {
		loginProcess();
	}
	else if (e.key === 'Enter' && twoFAmodal.classList.contains('show')) {
		twoFactorAuthLoginButton();
	}
}