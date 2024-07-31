
export var user_is_active = localStorage.getItem("user_is_active") || false;

//set username and profile pic in navbar
document.addEventListener('DOMContentLoaded', () => {


});


//change user state (log in or log out)
// update profile view, store username & avatar in local storage
export const updateProfile = async (user, isConnected, token) => {
	const navProfileElements = document.getElementById('nav-profile-elements');
	const navLogoLink = document.getElementById('logo');
	// const navProfilePic = document.getElementById('nav-profile-pic');
	// const navUsername = document.getElementById('nav-username');

	if (isConnected) {
		navProfileElements.classList.remove('hidden');
		navLogoLink.href = "/profile";
		// navProfilePic.src = user.avatar;
		// navUsername.textContent = user.username;
		localStorage.setItem('user_is_active', true);
		user_is_active = true;
		// localStorage.setItem('username', user.username);
		// localStorage.setItem('avatar', user.avatar);
		localStorage.setItem('token', token);


	}
	else {
		navProfileElements.classList.add('hidden');
		navLogoLink.href = "/";
		// navProfilePic.src = "";
		// navUsername.textContent = "";
		localStorage.setItem('user_is_active', false);
		user_is_active = false;
		// localStorage.removeItem('username');
		// localStorage.removeItem('avatar');
		localStorage.removeItem('token');


	}
}