export var twoFactorAuth = (localStorage.getItem("twoFactorAuth") === "true");

async function twoFactorAuthVerification(twoFactorAuthCode) {
	const token = localStorage.getItem("token");
    await fetch('api/login/token/verify-2fa/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
		body: JSON.stringify({
			"twoFactorAuth": twoFactorAuthCode,
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

async function verifyTwoFactorAuthCode()
{
    document.getElementById('confirm-2fa-activation').onclick = async function() {
        const input = document.getElementById('activationCode');
		const twoFaAuthCode = input.value;
        const response = await twoFactorAuthVerification(twoFaAuthCode);

        if (response.success) {
            console.log("User log: 2FA activation successful");
            return true;
        }
        else {
            console.log("User log: 2FA activation error ", response.error);
            return false;
        }
    }
}

export function twoFactorAuthButton() {
	const twoFAbtn = document.getElementById("twoFactorAuth-btn");
    const activateModal = new bootstrap.Modal(document.getElementById('activate-2fa-modal'));
	if (twoFactorAuth === false) {
        if (verifyTwoFactorAuthCode() === true) {
            twoFAbtn.innerHTML = "Deactivate";
            twoFAbtn.classList.remove("btn-outline-success");
            twoFAbtn.classList.add("btn-outline-danger");
            twoFAbtn.setAttribute('data-bs-target', '#deactivate-2fa-modal');
            activateModal.hide();
            localStorage.setItem('twoFactorAuth', true);
            twoFactorAuth = true;
            //set 2fa verification to true in backend
        }
        else
            activateModal.hide();
	} else {
		twoFAbtn.innerHTML = "Activate";
		twoFAbtn.classList.remove("btn-outline-danger");
		twoFAbtn.classList.add("btn-outline-success");
		twoFAbtn.setAttribute('data-bs-target', '#activate-2fa-modal');
		const deactivateModal = bootstrap.Modal.getInstance(document.getElementById('deactivate-2fa-modal'));
        deactivateModal.hide();
		localStorage.setItem('twoFactorAuth', false);
		twoFactorAuth = false;
	}
}
