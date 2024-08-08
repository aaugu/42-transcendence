export var twoFactorAuth = (localStorage.getItem("twoFactorAuth") === "true");

export async function twoFactorAuthVerification(twoFactorAuthCode) {
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
            if (response.status === 401) {
                if (error.detail) {
                    if (typeof(error.detail) == 'string')
                        errormsg(error.detail);
                    else
                        errormsg(error.detail[0]);
                }
            }
            else if (response.status === 404) {
                if (error.detail) {
                    if (typeof(error.detail) == 'string')
                        errormsg(error.detail);
                    else
                        errormsg(error.detail[0]);
                }
            }
            throw new Error(`HTTP status code ${response.status}`);
        }
        return response.json()
    })
    .then(responseData => {
            if (responseData !== null) {
                console.log(JSON.stringify(responseData));
                console.log("User log: TWO FACTOR AUTHORIZATION SUCCESSFUL");
                return responseData;
            }
    })
    .catch(e => {
        console.error('User log: TWO FACTOR AUTHORIZATION FETCH FAILURE, '+ e);
        return null;
    });

}


export function twoFactorAuthButton() {
	const twoFAbtn = document.getElementById("twoFactorAuth-btn");
	if (twoFactorAuth === false) {
		twoFAbtn.innerHTML = "Deactivate";
		twoFAbtn.classList.remove("btn-outline-success");
		twoFAbtn.classList.add("btn-outline-danger");
		twoFAbtn.setAttribute('data-bs-target', '#deactivate-2fa-modal');
		const activateModal = bootstrap.Modal.getInstance(document.getElementById('activate-2fa-modal'));
        activateModal.hide();
		localStorage.setItem('twoFactorAuth', true);
		twoFactorAuth = true;
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
