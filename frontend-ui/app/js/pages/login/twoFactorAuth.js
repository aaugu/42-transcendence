export var twoFactorAuth = (localStorage.getItem("twoFactorAuth") === "true");

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