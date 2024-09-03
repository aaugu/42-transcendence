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