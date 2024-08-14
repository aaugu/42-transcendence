export function twoFactorAuthPage() {
    return `
    <div class="profile-box">
        <h1 class="text-bold display-5 m-2">Two Factor Authentication</h1>
        <br>
        <div class="text-start m-2 m-2 w-75 centered clearfix">
            <label class="form-label" for="2fa-code">Check your email for the verification code</label>
            <input type="text" class="form-control" id="2fa-code" placeholder="">
        </div>
        <row class="justify-content-center">
            <button type="submit" class="btn btn-dark" id="verify-2fa-btn">Verify code</button>
        </row>
    </div>
    `;
}