import { twoFactorAuth } from "../login/twoFactorAuth.js";

export var userIsConnected = (localStorage.getItem("userIsConnected") === "true");
export var defaultAvatar = "images/default_avatar.png"

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
		localStorage.setItem('userIsConnected', true);
		localStorage.setItem('username', user.username);
		localStorage.setItem('avatar', user.avatar);
		userIsConnected = true;
		// localStorage.setItem('username', user.username);
		// localStorage.setItem('avatar', user.avatar);
		localStorage.setItem('token', token);

	}
	else {
		navProfileElements.classList.add('hidden');
		navLogoLink.href = "/";
		// navProfilePic.src = "";
		// navUsername.textContent = "";
		localStorage.setItem('userIsConnected', false);
		localStorage.setItem('username', 'guest');
		localStorage.setItem('avatar', defaultAvatar);
		userIsConnected = false;
		// localStorage.removeItem('username');
		// localStorage.removeItem('avatar');
		localStorage.setItem('token', token);


	}
}

export function editUserInfoButton(e) {
	const editButton = e.target.closest('.edit-btn');
	const currentField = editButton.dataset.field;
	const editModal = new bootstrap.Modal(document.getElementById('edit-modal'));
	const editModalLabel = document.getElementById('edit-modal-label');
	const editLabel = document.getElementById('edit-label');
	const editInput = document.getElementById('edit-input');

	editModalLabel.textContent = `Edit ${currentField}`;
	editLabel.textContent = `Enter new ${currentField.toLowerCase()}`;
	// editInput.value = document.getElementById(`profile-${currentField.toLowerCase()}`).textContent;

	editForm.innerHTML = '';

    if (currentField === 'Avatar') {
        editForm.innerHTML = `
            <div class="mb-3">
                <label for="edit-input" class="form-label">Upload new avatar</label>
                <input type="file" class="form-control" id="edit-input" accept="image/png, image/jpeg">
            </div>`;
    } else if (currentField === 'Password') {
        editForm.innerHTML = `
            <div class="mb-3">
                <label for="edit-input" class="form-label">New Password</label>
                <input type="password" class="form-control" id="edit-input">
            </div>
            <div class="mb-3">
                <label for="edit-input-repeat" class="form-label">Repeat Password</label>
                <input type="password" class="form-control" id="edit-input-repeat">
            </div>`;
    } else {
        editForm.innerHTML = `
            <div class="mb-3">
                <label for="edit-input" class="form-label">New ${currentField}</label>
                <input type="text" class="form-control" id="edit-input">
            </div>`;
    }

	document.getElementById('edit-save').onclick = function() {
	  const newValue = editInput.value;

	  switch (currentField) {
		case 'Avatar':
		  // handle POST request to update username
		  break;
		case 'Username':
		  // handle POST request to update username
		  break;
		case 'Nickname':
		  // handle POST request to update nickname
		  break;
		case 'Email':
		  // handle POST request to update email
		  break;
		case 'Password':
		  // handle POST request to update password
		  break;
		default:
		  break;
	  }
	//   document.getElementById(`profile-${currentField.toLowerCase()}`).textContent = newValue;
	console.log(`User log: Changed ${currentField} to: ${newValue}`);
	editModal.hide();
	};

	editModal.show();
  }