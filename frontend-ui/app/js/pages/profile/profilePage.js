import { getUserInfo } from "../user/getUserInfo.js"
import { updateFriendList } from "./friends.js"
import { updateProfile } from "../user/updateProfile.js"
import { errormsg } from "../../dom/errormsg.js"

export async function profilePage() {
    var username = "Guest";
    var nickname = "Guest-nickname";
    var email = "Guest-email";
    var avatar = "images/default_avatar.png";
    var is_2fa_enabled = false;
    var friends_html = '';

    try {
        const userinfo = await getUserInfo();
        username = userinfo.username;
        nickname = userinfo.nickname;
        email = userinfo.email;
        avatar = userinfo.avatar;
        is_2fa_enabled = userinfo.is_2fa_enabled;

        friends_html = await updateFriendList();
    }
    catch (e) {
        if (e.message === "403") {
            updateProfile(false, null);
            errormsg('You were automatically logged out', 'homepage-errormsg');
            return '';
        }
        console.log("USER LOG: ", e.message);
    }

    localStorage.setItem('avatar', avatar);
    localStorage.setItem('nickname', nickname);

    return `
    <h2 class="text-bold display-6"></h2>
    <div class="two-column-container">
        <div class="column-left">
            <div id="user-management" class="content-box clearfix">
                <h5 class="m-2">User management</h5>
                <div class="profile-details">
                    <div class="usermanagement-item centered">
                        <img id="profile-avatar" src="${avatar}" alt="User Avatar" class="avatar-img">
                        <button id="edit-avatar" class="edit-btn" data-field="Avatar"><i class="fas fa-pen"></i></button>
                    </div>
                    <div class="usermanagement-item">
                        <p id="profile-username">${username}</p>
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
                        <p class="hidden m-2 text-danger" id="editmodal-errormsg"></p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-lightgrey" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-dark" id="edit-save">Save</button>
					</div>
				</div>
				</div>
			</div>

            <div id="2fa" class="content-box clearfix">
                <h5 class="m-2">2fa authentication</h5>
				<button type="button" class="btn ${is_2fa_enabled ? "btn-outline-danger" : "btn-outline-success"}" data-bs-toggle="modal"
				data-bs-target=${is_2fa_enabled ? "#deactivate-2fa-modal" : "#activate-2fa-modal"} id="2fa-profile-btn">${is_2fa_enabled ? "Deactivate" : "Activate"}</button>

				<!-- 2FA Modals -->
				<div class="modal fade" id="activate-2fa-modal" tabindex="-1" aria-labelledby="activate-2fa" aria-hidden="true">
					<div class="modal-dialog modal-dialog-centered">
						<div class="modal-content">
							<div class="modal-header">
								<h1 class="modal-title fs-5" id="activate-2fa">Activate 2FA</h1>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<p>You will be prompted to log in again. Are you sure?</p>
                                <p class="hidden m-2 text-danger" id="activate2fa-errormsg"></p>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-lightgrey" data-bs-dismiss="modal">No</button>
								<button type="button" class="btn btn-dark" id="confirm-2fa-activation">Yes</button>
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
								<p>Are you sure?</p>
                                <p class="hidden m-2 text-danger" id="deactivate2fa-errormsg"></p>
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
        <div class="column-right">
            <div id="personal-stats" class="content-box">
                <h5 class="m-2">Match history</h5>
                <div class="profile-details centered">
                    <p>Total wins: 3</p>
                    <p>Total losses: 2</p>
                </div>
                <ul class="list-group custom-scrollbar m-2 flex-grow-1">
                    <li class="list-group-item">
                        <span>Date</span>
                        <span>Opponent</span>
                        <span>WON/LOST</span>
                    </li>
                    <li class="list-group-item">
                        <span>Date</span>
                        <span>Opponent</span>
                        <span>WON/LOST</span>
                    </li>
                </ul>
            </div>
            <div class="content-box">
                <h5 class="m-2">Friends</h5>
                <div class="input-group m-2 justify-content-center">
                    <input id="friend-input" type="text" class="form-control rounded-end" placeholder="Type a nickname here" aria-label="Search" style="font-size: 10px;">
                    <div class="input-group-append m-2">
                        <button id="add-friend-btn" class="btn btn-dark" type="button" style="font-size: 10px;">Add as friend</button>
                    </div>
                </div>
                <p class="hidden m-2 text-danger" id="friendlist-errormsg"></p>
                <ul id="friend-list" class="list-group d-flex custom-scrollbar flex-grow-1 w-100 m-2">
                 ${friends_html}
                </ul>
            </div>
        </div>
    </div>
    <row class="justify-content-center">
        <button type="text" class="btn btn-danger" id="logout">Logout</button>
    </row>
    `;
}

