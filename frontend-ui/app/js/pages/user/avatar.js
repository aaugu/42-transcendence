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
	console.log("avatarFile: ", avatarFile);
	try {
		avatar = await readAvatarFile(avatarFile);
	} catch (error) {
		console.error("User log: Error reading avatar file,", error);
		avatar = defaultAvatar;
	}
	localStorage.setItem('avatar', avatar);
	document.getElementById('profile-avatar').src = avatar;

	editUserInfo('avatar', avatar);
}