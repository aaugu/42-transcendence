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
		errormsg("Passwords do not match");
		console.error("User log: Passwords do not match, password not changed");
		return;
	}
	if (!passwordValidity(newPassword)) {
		errormsg("Your password must be 8 - 25 characters long and include at least 1 special, 1 uppercase and 1 digit");
		console.error("User log: Invalid password");
		return;
	}

	// editUserInfo('password', newPassword);
}