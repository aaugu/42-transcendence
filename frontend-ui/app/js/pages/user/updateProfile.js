import { defaultAvatar } from './avatar.js';
import { getCookie } from './cookie.js';
import { logout } from './logout.js';
import { urlRoute } from '../../dom/router.js'

export var userID = null;

export function setUserID() {
	const token = getCookie('csrf_token');
    if (token === null)
        userID = null;
	else {
		const decodedToken = jwt_decode(token);
		userID = decodedToken.user_id;
	}
}

export const updateProfile = async (isConnected, token) => {
	if (isConnected) {
		document.getElementById('nav-profile-elements').classList.remove('hidden');
		document.getElementById('logo').href = "/profile";
		const expirationDate = new Date();
		expirationDate.setTime(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 1 week
		document.cookie = `csrf_token=${token}; path=/; SameSite=None; Secure=true; expires=${expirationDate.toUTCString()}`;
		setUserID();
	}
	else {
		try {
			await logout();
		}
		catch (e) {
			console.log(`USER LOG: ${e.message}`);
		}
		document.getElementById('nav-profile-elements').classList.add('hidden');
		document.getElementById('logo').href = "/";
		localStorage.setItem('nickname', 'guest');
		localStorage.setItem('avatar', defaultAvatar);
		document.cookie = `csrf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		document.cookie = `csrftoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		document.cookie = `sessionid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		setUserID();
		urlRoute('/');
	}
}
