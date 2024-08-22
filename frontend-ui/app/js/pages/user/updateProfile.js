export var userIsConnected = (localStorage.getItem("userIsConnected") === "true");
export var defaultAvatar = "images/default_avatar.png"

//change user state (log in or log out)
// update profile view, store username & avatar in local storage
export const updateProfile = async (user, isConnected, token) => {
	const navProfileElements = document.getElementById('nav-profile-elements');
	const navLogoLink = document.getElementById('logo');

	if (isConnected) {
		// navProfileElements.classList.remove('hidden');
		navLogoLink.href = "/profile";
		localStorage.setItem('userIsConnected', true);
		localStorage.setItem('username', user.username);
		// localStorage.setItem('avatar', user.avatar);
		const expirationDate = new Date();
		expirationDate.setTime(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 1 week
		document.cookie = `csrf_token=${token}; path=/; SameSite=Lax; expires=${expirationDate.toUTCString()}`;
		userIsConnected = true;
		// localStorage.setItem('token', token);

	}
	else {
		// navProfileElements.classList.add('hidden');
		navLogoLink.href = "/";
		localStorage.setItem('userIsConnected', false);
		localStorage.setItem('username', 'guest');
		localStorage.setItem('avatar', defaultAvatar);
		document.cookie = `csrf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		userIsConnected = false;
		// localStorage.setItem('token', token);


	}
}
