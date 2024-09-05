export function loginPage() {
    return `
    <div class="content-box">
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
		<!-- 2FA Modal -->
		<div class="modal fade" id="login-2fa-modal" tabindex="-1" aria-labelledby="login-2fa" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h1 class="modal-title fs-5" id="login-2fa">Verify your email</h1>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p>A code has been sent to your email. Please enter it below.</p>
						<input type="text" class="form-control" id="2fa-code" placeholder="Enter verification code">
						<p class="hidden m-2 text-danger" id="login-twoFA-errormsg"></p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-lightgrey" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-dark" id="verify-2fa-code">Submit</button>
					</div>
				</div>
			</div>
		</div>
    </div>
    `;
}