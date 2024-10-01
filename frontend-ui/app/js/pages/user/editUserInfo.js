import { editAvatar } from "./avatar.js";
import { editPassword } from "./password.js";
import { errormsg } from "../../dom/errormsg.js";
import { hideModal } from "../../dom/modal.js";
import { userID } from "./updateProfile.js";

export async function editUserInfo(infoType, newInfo) {
	if (userID === null)
        throw new Error ("Could not identify user");
	const url = 'https://' + window.location.host + '/api/user/';

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

        if (!response.ok && response.status === 502) {
            throw new Error(`${response.status}`);
        }
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
        }
    } catch (e) {
        console.log(e);
        console.error('USER LOG: USER PATCH FETCH FAILURE, ' + e.message);
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
                <label for="edit-input-old-pass" class="form-label">Old Password</label>
                <input type="password" class="form-control" id="edit-input-old-pass">
            </div>
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
					localStorage.setItem('nickname', newValue);
                    break;
                case 'Email':
                    await editUserInfo('email', newValue);
                    userInfoID.innerText = newValue;
                    break;
                case 'Password':
                    await editPassword(newValue, document.getElementById('edit-input-repeat').value,
                        document.getElementById('edit-input-old-pass').value);
                    break;
                default:
				break;
            }
            console.log(`USER LOG: SUCCESSFULLY CHANGED ${currentField}`);
            hideModal('edit-modal');
        } catch (e) {
            if (e.message === "502") {
                errormsg("Service temporarily unavailable", "editmodal-errormsg");
            } else {
                errormsg(e.message, 'editmodal-errormsg');
            }
            console.log(`USER LOG: ${e.message}`);
        }

	};

    const editModal = new bootstrap.Modal(document.getElementById('edit-modal'));
	editModal.show();
  }