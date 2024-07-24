export function profilePage() {

    return `
    <h1 class="text-bold display-3">Profile!</h1>
    <br>
    <h2 class="small">Some information about yourself</h2>
	<div class="flex-container">
	<div class="flex-col">
		<div class="large-box">
		</div>
	</div>
	<div class="flex-col">
		<div class="small-box">
		</div>

	</div>
		<div class="medium-box">
	</div>
		<div class="medium-box">
	</div>
	</div>
	<row class="justify-content-center">
        <button type="text" class="btn btn-danger" id="logout">Logout</button>
    </row>
    `;
}