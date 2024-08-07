import { twoFactorAuth } from "../login/twoFactorAuth.js";

export function profilePage() {
    // const mainCont = document.getElementById("main-content");
    // mainCont.style.backgroundColor = "rgba(245, 245, 245, 0)";

    const username = localStorage.getItem("username") || "Guest";
    const nickname = localStorage.getItem("nickname") || "Guest-nickname";
    const email = localStorage.getItem("email") || "Guest-email";
    const avatar = localStorage.getItem("avatar") || "images/default_avatar.png";

	var twoFAbtnText;
	var twoFAbtnColor;

	if (twoFactorAuth == true) {
		twoFAbtnText = "Deactivate";
		twoFAbtnColor = "btn-outline-danger";
	}
	else {
		twoFAbtnText = "Activate";
		twoFAbtnColor = "btn-outline-success";
	}

    return `
    <h2 class="text-bold display-6"></h2>
    <div class="profile-content">
        <div class="profile-column-left">
            <div id="user-management" class="profile-box clearfix">
                <h5 class="m-2">User management</h5>
                <div class="profile-details">
                    <div class="usermanagement-item centered">
                        <img id="profile-avatar" src="${avatar}" alt="User Avatar" class="avatar-img">
                        <button id="edit-avatar" class="edit-btn"><i class="fas fa-pen"></i></button>
                    </div>
                    <div class="usermanagement-item">
                        <p id="profile-username">${username}</p>
                        <button id="edit-username" class="edit-btn"><i class="fas fa-pen"></i></button>
                    </div>
                    <div class="usermanagement-item">
                        <p id="profile-nickname">${nickname}</p>
                        <button id="edit-nickname" class="edit-btn"><i class="fas fa-pen"></i></button>
                    </div>
                    <div class="usermanagement-item">
                        <p id="profile-email">${email}</p>
                        <button id="edit-email" class="edit-btn"><i class="fas fa-pen"></i></button>
                    </div>
                    <div class="usermanagement-item">
                        <p id="profile-password">Password</p>
                        <button id="edit-password" class="edit-btn"><i class="fas fa-pen"></i></button>
                    </div>
                </div>
            </div>
            <div id="2fa" class="profile-box clearfix">
                <h5 class="m-2">2fa authentication</h5>
                <button type="text" class="centered btn ${twoFAbtnColor} m-2" id="twoFactorAuth-btn">${twoFAbtnText}</button>
            </div>
        </div>
        <div class="profile-column-right">
            <div id="personal-stats" class="profile-box clearfix">
                <h5 class="m-2">Personal stats</h5>
                <div class="profile-details">
                    <p>Total wins: 3</p>
                    <p>Total losses: 2</p>
                </div>
                <div>
                <ul class="list-group overflow-auto m-2" style="max-height: 100px;">
                    <li class="list-group-item">
                        <text>Date</text>
                        <text>Opponent</text>
                        <text>WON/LOST</text>
                    </li>
                    <li class="list-group-item">
                        <text>Date</text>
                        <text>Opponent</text>
                        <text>WON/LOST</text>
                    </li>
                    <li class="list-group-item">
                        <text>Date</text>
                        <text>Opponent</text>
                        <text>WON/LOST</text>
                    </li>
                    <li class="list-group-item">
                        <text>Date</text>
                        <text>Opponent</text>
                        <text>WON/LOST</text>
                    </li>
                    <li class="list-group-item">
                        <text>Date</text>
                        <text>Opponent</text>
                        <text>WON/LOST</text>
                    </li>
                </ul>
                </div>
            </div>
            <div id="friends" class="profile-box">
                <h5 class="m-2">Friend list</h5>
            </div>
        </div>
    </div>
    <row class="justify-content-center">
        <button type="text" class="btn btn-danger" id="logout">Logout</button>
    </row>
    `;
}