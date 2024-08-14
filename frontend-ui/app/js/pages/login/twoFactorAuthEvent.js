import { errormsg } from '../../dom/errormsg.js';
import { urlRoute } from '../../dom/router.js';
import { verifyTwoFactorAuth } from './twoFactorAuth.js';

export async function twoFactorAuthEvent(e) {
	switch (e.target.id) {
			case "verify-2fa-btn":
				const input = document.getElementById('2fa-code');
				const twoFaAuthCode = input.value;
				input.value = '';
				if (twoFaAuthCode == '') {
					errormsg('Please enter a code', 'twoFA-errormsg');
					return ;
				}
				const response = await verifyTwoFactorAuth(twoFaAuthCode);
				if (response.success == true) {
					urlRoute('/profile');
				}
				else {
					errormsg("Invalid verification code", 'homepage-errormsg');
				}
	}
}