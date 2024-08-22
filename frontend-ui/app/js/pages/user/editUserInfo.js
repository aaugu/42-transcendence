import { editAvatar } from "./avatar.js";
import { editPassword } from "./password.js";
import { getCookie } from "./cookie.js";
import { errormsg } from "../../dom/errormsg.js";

export async function editUserInfo(infoType, newInfo) {
	const token = getCookie('csrf_token');
	if (token === null)
        return { success: false, data: "No token" };

	const decodedToken = jwt_decode(token);
	const url = 'https://localhost:10444/api/user/';

	try {
        const response = await fetch(url + decodedToken.user_id + '/', {
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
			if (response.status === 400 || response.status === 404) {
				if (error.email)
					errormsg(error.email, "editmodal-errormsg");
			}
            throw new Error(`HTTP status code ${response.status}`);
        }
        const responseData = await response.json();
        if (responseData !== null) {
            console.log("User log: USER PATCH SUCCESSFUL");
            return { success: true, data: responseData };
        } else {
			errormsg("Internal error", "editmodal-errormsg");
            throw new Error(`Empty response`);
        }
    } catch (e) {
        console.error('User log: USER PATCH FETCH FAILURE, ' + e);
        return { success: false, data: e.message || "Fetch error" };
    }
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

	document.getElementById('edit-save').onclick = async function() {
		const editInput = document.getElementById('edit-input');
		const newValue = editInput.value;
		const userInfoID = document.getElementById("profile-" + currentField.toLowerCase());
		var response = null;

		if (newValue === '') {
			errormsg('Field cannot be empty', 'editmodal-errormsg');
			return;
		}

		switch (currentField) {
			case 'Avatar':
				response = await editAvatar(editInput);
				break;
			case 'Nickname':
				response = await editUserInfo('nickname', newValue);
				if (response.success == true)
					userInfoID.innerText = newValue;
				break;
			case 'Email':
				response = await editUserInfo('email', newValue);
				if (response.success == true)
					userInfoID.innerText = newValue;
				break;
			case 'Password':
				response = editPassword(newValue, document.getElementById('edit-input-repeat').value);
				break;
			default:
				response.success = false;
				break;
		}
		if (response.success == true)
			console.log(`User log: CHANGED ${currentField} TO ${newValue}`);
		editModal.hide();
	};


	editModal.show();
  }