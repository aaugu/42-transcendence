import { defaultAvatar } from './avatar.js';
import { getCookie } from './cookie.js';

export var userIsConnected = (localStorage.getItem("userIsConnected") === "true");
export var userID = null;

function setUserID() {
	const token = getCookie('csrf_token');
    if (token === null)
        userID = null;
	else {
		const decodedToken = jwt_decode(token);
		userID = decodedToken.user_id;
	}
}

//change user state (log in or log out)
// update profile view, store username & avatar in local storage
export const updateProfile = async (nickname, isConnected, token) => {
	const navProfileElements = document.getElementById('nav-profile-elements');
	const navLogoLink = document.getElementById('logo');

	if (isConnected) {
		// navProfileElements.classList.remove('hidden');
		navLogoLink.href = "/profile";
		localStorage.setItem('userIsConnected', true);
		localStorage.setItem('nickname', nickname);
		// localStorage.setItem('avatar', user.avatar);
		const expirationDate = new Date();
		expirationDate.setTime(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 1 week
		document.cookie = `csrf_token=${token}; path=/; SameSite=None; Secure=true; expires=${expirationDate.toUTCString()}`;
		userIsConnected = true;
		setUserID();
	}
	else {
		// navProfileElements.classList.add('hidden');
		navLogoLink.href = "/";
		localStorage.setItem('userIsConnected', false);
		localStorage.setItem('nickname', 'guest');
		localStorage.setItem('avatar', defaultAvatar);
		document.cookie = `csrf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		document.cookie = `csrftoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		document.cookie = `sessionid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		userIsConnected = null;
		userID = null;
	}
}
