export var twoFactorAuth = (localStorage.getItem("twoFactorAuth") === "true");

export function twoFactorAuthButton() {
	const twoFAbtn = document.getElementById("twoFactorAuth-btn");
	if (twoFactorAuth === false) {
		console.log("twoFactorAuth is true");
		twoFAbtn.innerHTML = "Deactivate";
		twoFAbtn.classList.remove("btn-outline-success");
		twoFAbtn.classList.add("btn-outline-danger");
		localStorage.setItem('twoFactorAuth', true);
		twoFactorAuth = true;
	} else {
		twoFAbtn.innerHTML = "Activate";
		twoFAbtn.classList.remove("btn-outline-danger");
		twoFAbtn.classList.add("btn-outline-success");
		localStorage.setItem('twoFactorAuth', false);
		twoFactorAuth = false;
	}
}