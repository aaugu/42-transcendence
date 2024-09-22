import { userID } from './updateProfile.js';

export function passwordValidity (password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8 && password.length <= 25;

    return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && isLongEnough;
}

export async function editPassword(newPassword, repeatNewPassword, oldPassword) {
	if (oldPassword === null || oldPassword === undefined || oldPassword === "") {
		throw new Error("Field cannot be empty");
	}
	if (newPassword !== repeatNewPassword) {
		throw new Error("Passwords do not match");
	}
	else if (!passwordValidity(newPassword)) {
		throw new Error("Your password must be 8 - 25 characters long and include at least 1 special, 1 uppercase and 1 digit");
	}
	if (userID === null)
		throw new Error("Could not identify user");

	const url = 'https://localhost:10443/api/user/';
	const response = await fetch(url + userID + '/changepass/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"old_password": oldPassword,
			"new_password": newPassword,
		}),
		credentials: 'include',
	});
	const responseData = await response.json();
	if (!response.ok) {
		if (responseData.old_password)
			throw new Error(responseData.old_password[0]);
		throw new Error("Could not edit user password");
	}
	if (responseData !== null) {
		console.log("USER LOG: USER EDIT SUCCESSFUL");
	}
}