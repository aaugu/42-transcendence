import { editAvatar } from "./avatar.js";
import { editPassword } from "./password.js";

export async function editUserInfo(infoType, newInfo) {
	const token = localStorage.getItem('token');
	const decodedToken = jwt_decode(token);

	const url = 'https://localhost:10444/api/user/';
	await fetch(url + decodedToken.user_id + '/', {
		method: 'PATCH',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			[infoType] : newInfo,
		}),
		credentials: 'include', //include the cookies like this
	})
	.then(async response => {
		if (!response.ok) {
			const error = await response.json();
			//determine which error codes to handle
			throw new Error(`HTTP status code ${response.status}`);
		}
		return response.json()
	})
	.then(responseData => {
		if (responseData !== null) {
			//if concerning username -> update in localStorage
			console.log(JSON.stringify(responseData));
			console.log("User log: USER PATCH SUCCESSFUL");
			return { success: true, data: responseData };
		}
	})
	.catch(e => {
		console.error('User log: USER PATCH FETCH FAILURE, '+ e);
		return { success: false, error: e.message || "Fetch error" };
	});
}

export function editUserInfoButton(e) {
	const editButton = e.target.closest('.edit-btn');
	const currentField = editButton.dataset.field;
	const editModal = new bootstrap.Modal(document.getElementById('edit-modal'));
	const editModalLabel = document.getElementById('edit-modal-label');

	editModalLabel.textContent = `Edit ${currentField}`;
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
		const editInput = document.getElementById('edit-input');
		const newValue = editInput.value;
		const userInfoID = document.getElementById("profile-" + currentField.toLowerCase());

		switch (currentField) {
			case 'Avatar':
				editAvatar(editInput);
				break;
			case 'Username':
				// editUserInfo('username', newValue);
				userInfoID.innerText = newValue;
				localStorage.setItem('username', newValue);
				break;
			case 'Nickname':
				editUserInfo('nickname', newValue);
				userInfoID.innerText = newValue;
				break;
			case 'Email':
				// editUserInfo('email', newValue);
				userInfoID.innerText = newValue;
				break;
			case 'Password':
				editPassword(newValue, document.getElementById('edit-input-repeat').value);
				break;
			default:
				break;
		}
		console.log(`User log: Changed ${currentField} to: ${newValue}`);
		editModal.hide();
	};


	editModal.show();
  }