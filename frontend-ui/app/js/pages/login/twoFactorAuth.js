import { errormsg } from "../../dom/errormsg.js";

export var twoFactorAuth = (localStorage.getItem("twoFactorAuth") === "true");

async function verifyTwoFactorAuth(twoFactorAuthCode) {
	const token = localStorage.getItem("token");
    await fetch('api/login/token/verify-2fa/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
		body: JSON.stringify({
			"verification_code": twoFactorAuthCode,
		}),
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.json();
			//handle error code correctly
            throw new Error(`HTTP status code ${response.status}`);
        }
        return response.json()
    })
    .then(responseData => {
            if (responseData !== null) {
                console.log(JSON.stringify(responseData));
                console.log("User log: TWO FACTOR AUTHORIZATION SUCCESSFUL");
                return { success: true, data: responseData };
            }
    })
    .catch(e => {
        console.error('User log: TWO FACTOR AUTHORIZATION FETCH FAILURE, '+ e);
        return { success: false, error: e.message || "Fetch error" };
    });
}

async function sendTwoFactorAuthCode()
{
    //send verification code to email
}

export async function twoFactorAuthButton() {
	const twoFAbtn = document.getElementById("twoFactorAuth-btn");
	if (twoFactorAuth === false) {
        // sendTwoFactorAuthCode();
        const input = document.getElementById('activationCode');
        const twoFaAuthCode = input.value;
        if (twoFaAuthCode == '') {
            const errmsg = document.getElementById('twoFAerrormsg');
            errmsg.classList.remove('hidden');
            setTimeout(() => {
                errmsg.classList.add('hidden');
            }, 3000);
            return ;
        }
        // const response = await verifyTwoFactorAuth(twoFaAuthCode);

        // if (response.success == true) {
            console.log("User log: 2FA activation successful");
            twoFAbtn.innerHTML = "Deactivate";
            twoFAbtn.classList.remove("btn-outline-success");
            twoFAbtn.classList.add("btn-outline-danger");
            twoFAbtn.setAttribute('data-bs-target', '#deactivate-2fa-modal');
            localStorage.setItem('twoFactorAuth', true);
            twoFactorAuth = true;
            //set 2fa verification to true in backend
            const activateModal = bootstrap.Modal.getInstance(document.getElementById('activate-2fa-modal'));
            if (activateModal) {
                activateModal.hide();
            }
        // }
        // else {
        //     console.log("User log: 2FA activation error ", response.error);
        //     activateModal.hide();
        // }
	} else {
        console.log("User log: 2FA de-activation successful");
		twoFAbtn.innerHTML = "Activate";
		twoFAbtn.classList.remove("btn-outline-danger");
		twoFAbtn.classList.add("btn-outline-success");
		twoFAbtn.setAttribute('data-bs-target', '#activate-2fa-modal');
		const deactivateModal = bootstrap.Modal.getInstance(document.getElementById('deactivate-2fa-modal'));
        if (deactivateModal) {
            deactivateModal.hide();
        }
		localStorage.setItem('twoFactorAuth', false);
		twoFactorAuth = false;
	}
}
