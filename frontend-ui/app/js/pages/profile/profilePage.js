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
    var twoFAtargetModal;

	if (twoFactorAuth == true) {
		twoFAbtnText = "Deactivate";
		twoFAbtnColor = "btn-outline-danger";
        twoFAtargetModal = "#deactivate-2fa-modal"
	}
	else {
		twoFAbtnText = "Activate";
		twoFAbtnColor = "btn-outline-success";
        twoFAtargetModal = "#activate-2fa-modal"
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
                        <button id="edit-avatar" class="edit-btn" data-field="Avatar"><i class="fas fa-pen"></i></button>
                    </div>
                    <div class="usermanagement-item">
                        <p id="profile-username">${username}</p>
                        <button id="edit-username" class="edit-btn" data-field="Username"><i class="fas fa-pen"></i></button>
                    </div>
                    <div class="usermanagement-item">
                        <p id="profile-nickname">${nickname}</p>
                        <button id="edit-nickname" class="edit-btn" data-field="Nickname"><i class="fas fa-pen"></i></button>
                    </div>
                    <div class="usermanagement-item">
                        <p id="profile-email">${email}</p>
                        <button id="edit-email" class="edit-btn" data-field="Email"><i class="fas fa-pen"></i></button>
                    </div>
                    <div class="usermanagement-item">
                        <p id="profile-password">Password</p>
                        <button id="edit-password" class="edit-btn" data-field="Password"><i class="fas fa-pen"></i></button>
                    </div>
                </div>
            </div>

			<!-- Edit Modal -->
			<div class="modal fade" id="edit-modal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="edit-modal-label">Edit user info</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
					<form id="editForm"></form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-lightgrey" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-dark" id="edit-save">Save</button>
					</div>
				</div>
				</div>
			</div>

            <div id="2fa" class="profile-box clearfix">
                <h5 class="m-2">2fa authentication</h5>
				<button type="button" class="btn ${twoFAbtnColor}" data-bs-toggle="modal"
				data-bs-target=${twoFAtargetModal} id="twoFactorAuth-btn">${twoFAbtnText}</button>

				<!-- 2FA Modals -->
				<div class="modal fade" id="activate-2fa-modal" tabindex="-1" aria-labelledby="activate-2fa" aria-hidden="true">
					<div class="modal-dialog modal-dialog-centered">
						<div class="modal-content">
							<div class="modal-header">
								<h1 class="modal-title fs-5" id="activate-2fa">Activate 2FA</h1>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<p>A code has been sent to your email. Please enter the code below to activate 2FA.</p>
          						<input type="text" class="form-control" id="activationCode" placeholder="Enter activation code">
                                <p class="hidden m-2 text-danger" id="twoFAerrormsg">Please enter a code</p>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-lightgrey" data-bs-dismiss="modal">Close</button>
								<button type="button" class="btn btn-dark" id="confirm-2fa-activation">Verify code</button>
							</div>
						</div>
					</div>
				</div>
				<div class="modal fade" id="deactivate-2fa-modal" tabindex="-1" aria-labelledby="deactivate-2fa" aria-hidden="true">
					<div class="modal-dialog modal-dialog-centered">
						<div class="modal-content">
							<div class="modal-header">
								<h1 class="modal-title fs-5" id="deactivate-2fa">Deactive 2FA</h1>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<p>Are you sure you want to deactivate 2FA?</p>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-lightgrey" data-bs-dismiss="modal">No</button>
								<button type="button" class="btn btn-dark" id="confirm-2fa-deactivation">Yes</button>
							</div>
						</div>
					</div>
				</div>
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

