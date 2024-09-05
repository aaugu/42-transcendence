import { editUserInfo } from './editUserInfo.js';

export const defaultAvatar = "images/default_avatar.png"

export function readAvatarFile(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function(event) {
            resolve(event.target.result);
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}

export async function editAvatar(input) {
	var avatarFile = input.files[0];
	var avatar;
	var response;
	// try {
		avatar = await readAvatarFile(avatarFile);
		response = await editUserInfo('avatar', avatar);

		document.getElementById('profile-avatar').src = avatar;
		localStorage.setItem('avatar', avatar);
	// } catch (error) {
	// 	console.error("USER LOG: ERROR READING FILE,", error);
	// 	throw new Error("Error reading new file");
	// }
}