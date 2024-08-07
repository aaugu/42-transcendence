export var twoFactorAuth = (localStorage.getItem("twoFactorAuth") === "true");

export function twoFactorAuthButton() {
	const FAbtn = document.getElementById("twoFactorAuth-btn");
	console.log("two factor value in local storage: ", twoFactorAuth);
	if (twoFactorAuth === false) {
		console.log("twoFactorAuth is true");
		FAbtn.innerHTML = "Deactivate";
		FAbtn.classList.remove("btn-outline-success");
		FAbtn.classList.add("btn-outline-danger");
		localStorage.setItem('twoFactorAuth', true);
		twoFactorAuth = true;
	} else {
		FAbtn.innerHTML = "Activate";
		FAbtn.classList.remove("btn-outline-danger");
		FAbtn.classList.add("btn-outline-success");
		localStorage.setItem('twoFactorAuth', false);
		twoFactorAuth = false;
	}
}