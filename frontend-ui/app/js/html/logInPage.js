export function loginPage() {
    return `
    <h1 class="text-bold display-5">Log in here</h1>
    <br>
    <div class="mb-3 text-start clearfix">
        <label class="form-label" for="username">Username</label>
        <input type="text" class="form-control" id="username" placeholder="Bob">
        <label class="form-label" for="password">Password</label>
        <input type="password" class="form-control" id="password" placeholder="***">
    </div>
    <row class="justify-content-center">
        <button type="submit" class="btn btn-dark" id="login-submit">Log in</button>
    </row> 
    `;
}