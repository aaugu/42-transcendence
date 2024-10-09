export function signupPage() {
    document.getElementById('nav-profile-elements').classList.add('hidden');
	document.getElementById('logo').href = "/";

    return `
    <div class="content-box">
        <h1 class="text-bold display-5 m-2">Sign up here</h1>
        <br>
        <div class="text-start m-2 w-75 centered clearfix">
            <label class="form-label" for="username">Username</label>
            <input type="text" class="form-control" id="username" placeholder="Bob">
            <label class="form-label mt-3" for="nickname">Nickname</label>
            <input type="text" class="form-control" id="nickname" placeholder="Pong master">
            <label class="form-label mt-3" for="email">E-mail</label>
            <input type="email" class="form-control" id="email" placeholder="bob@email.com">
            <label class="form-label mt-3" for="password">Password</label>
            <input type="password" class="form-control" id="password" placeholder="***">
            <label class="form-label mt-3" for="repeat-password">Repeat password</label>
            <input type="password" class="form-control" id="repeat-password" placeholder="***">
             <label class="form-label mt-3" for="avatar">Avatar</label>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="avatarOption" id="defaultAvatar" value="default" checked>
                <label class="form-check-label" for="defaultAvatar">
                    Use default avatar
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="avatarOption" id="uploadAvatar" value="upload">
                <label class="form-check-label">
                    Upload your own avatar
                </label>
            </div>
            <input type="file" class="form-control mt-2" id="avatar-upload-file" accept="image/png, image/jpeg" style="display: none;">
        </div>
        <row class="justify-content-center">
            <button type="submit" class="btn btn-dark" id="signup-submit">Sign up</button>
            <p class="hidden m-2 text-danger" id="signup-errormsg"></p>
        </row>
    </div>
    `;
}
