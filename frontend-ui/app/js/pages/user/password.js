import { errormsg } from '../../dom/errormsg.js';
import { getCookie } from './cookie.js';

export function passwordValidity (password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8 && password.length <= 25;

    return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && isLongEnough;
}

export async function editPassword(newPassword, repeatNewPassword) {
	if (newPassword !== repeatNewPassword) {
		errormsg("Passwords do not match", "editmodal-errormsg");
		return;
	}
	else if (!passwordValidity(newPassword)) {
		errormsg("Your password must be 8 - 25 characters long and include at least 1 special, 1 uppercase and 1 digit", "editmodal-errormsg");
		return;
	}
	try {
		const token = getCookie('csrf_token');
		if (token === null)
			throw new Error("No token");

		const decodedToken = jwt_decode(token);
		const url = 'https://localhost:10444/api/user/changepass/';

		const response = await fetch(url + decodedToken.user_id + '/', {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"password": newPassword,
			}),
			credentials: 'include',
		});

		if (!response.ok) {
			const error = await response.json();
			if (response.status === 400 || response.status === 404) {
				if (error.password)
					errormsg(error.password, "editmodal-errormsg");
			}
			throw new Error(`HTTP status code ${response.status}`);
		}
		const responseData = await response.json();
		if (responseData !== null) {
			console.log("User log: USER PATCH SUCCESSFUL");
			return { success: true, data: responseData };
		} else {
			throw new Error(`Empty response`);
		}
	} catch (error) {
		console.error("User log: PASSWORD CHANGE", error);
		errormsg("Internal error, try later", "editmodal-errormsg");
		return { success: false };
	}
}