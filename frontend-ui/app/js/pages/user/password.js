import { errormsg } from '../../dom/errormsg.js';

export function passwordValidity (password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8 && password.length <= 25;

    return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && isLongEnough;
}

export function editPassword(newPassword, repeatNewPassword) {
	if (newPassword !== repeatNewPassword) {
		errormsg("Passwords do not match", "editmodal-errormsg");
		return;
	}
	else if (!passwordValidity(newPassword)) {
		errormsg("Your password must be 8 - 25 characters long and include at least 1 special, 1 uppercase and 1 digit", "editmodal-errormsg");
		return;
	}
	// else
	// editUserInfo('password', newPassword);
}