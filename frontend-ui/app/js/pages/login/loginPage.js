export function loginPage() {
    return `
    <div class="profile-box">
        <h1 class="text-bold display-5 m-2">Log in here</h1>
        <br>
        <div class="text-start m-2 m-2 w-75 centered clearfix">
            <label class="form-label" for="username">Username</label>
            <input type="text" class="form-control" id="username" placeholder="Bob">
            <label class="form-label mt-3" for="password">Password</label>
            <input type="password" class="form-control" id="password" placeholder="***">
        </div>
        <row class="justify-content-center">
            <button type="submit" class="btn btn-dark" id="login-submit">Log in</button>
        </row>
    </div>
    `;
}