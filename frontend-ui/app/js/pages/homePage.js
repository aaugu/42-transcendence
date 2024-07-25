import { isLoggedIn } from "./login/isLoggedIn.js";

export function homePage() {
    const mainCont = document.getElementById("main-content");
    mainCont.style.backgroundColor = "rgba(245, 245, 245, 0)";
    return `
    <h2 class="text-bold display-6">Profile</h2>
    <div class="profile-row">
        <div class="profile-column-left">
            <div id="user-management" class="profile-box clearfix">
                <h5 class="m-2">User management</h5>
            </div>
            <div id="2fa" class="profile-box clearfix">
                <h5 class="m-2">2fa authentication</h5>
                <button type="text" class="selected btn btn-success m-2" id="2fa-button">Activate</button>
            </div>
        </div>
        <div class="profile-column-right">
            <div id="personal-stats" class="profile-box cleafix" style="height: 200px;">
                <h5 class="m-2">Personal stats</h5>
                <div class="profile-box justify-content-center " style="flex-direction: row;">
                    <div>
                        <img src="images/trophy.jpg" alt="" class="thumb-icon">
                        <div class="text-sm m-2">xyz</div>
                    </div>
                    <div>
                        <img src="images/thumb_down_red.jpg" alt="" class="thumb-icon">
                        <div class="text-sm m-2">xyz</div>
                    </div>
                </div>
                <div class="text-sm m-2">Game history</div>
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