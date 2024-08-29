import { editAvatar } from "./avatar.js";
import { editPassword } from "./password.js";
import { errormsg } from "../../dom/errormsg.js";
import { hideModal } from "../../dom/modal.js";
import { userID } from "./updateProfile.js";

export async function editUserInfo(infoType, newInfo) {
	if (userID === null)
        throw new Error ("Could not identify user");
	const url = 'https://localhost:10444/api/user/';

	try {
        const response = await fetch(url + userID + '/', {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                [infoType]: newInfo,
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
			if (response.status === 400) {
				if (error.email)
					throw new Error(error.email);
                if (error.nickname)
                    throw new Error(error.nickname);
			}
            throw new Error('Could not edit user info');
        }
        const responseData = await response.json();
        if (responseData !== null) {
            console.log("User log: USER PATCH SUCCESSFUL");
        } else {
            throw new Error('No response from server');
        }
    } catch (e) {
        console.error('User log: USER PATCH FETCH FAILURE, ' + e.message);
        throw new Error(e.message);
    }
}

export function editUserInfoModal(e) {
	const editButton = e.target.closest('.edit-btn');
	const currentField = editButton.dataset.field;
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

	document.getElementById('edit-save').onclick = async function() {
		const editInput = document.getElementById('edit-input');
		const newValue = editInput.value;
		const userInfoID = document.getElementById("profile-" + currentField.toLowerCase());

		if (newValue === '') {
			errormsg('Field cannot be empty', 'editmodal-errormsg');
			return;
		}
        try {
            switch (currentField) {
                case 'Avatar':
                    await editAvatar(editInput);
                    break;
                case 'Nickname':
                    await editUserInfo('nickname', newValue);
                    userInfoID.innerText = newValue;
                    break;
                case 'Email':
                    await editUserInfo('email', newValue);
                    userInfoID.innerText = newValue;
                    break;
                case 'Password':
                    await editPassword(newValue, document.getElementById('edit-input-repeat').value);
                    break;
                default:
				break;
            }
            console.log(`User log: CHANGED ${currentField} TO ${newValue}`);
            hideModal('edit-modal');
        } catch (e) {
            errormsg(e.message, 'editmodal-errormsg');
            return;
        }

	};

    const editModal = new bootstrap.Modal(document.getElementById('edit-modal'));
	editModal.show();
  }