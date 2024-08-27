export async function getTournaments() {
	try {
		const response = await fetch('https://localhost:10444/api/tournament/remote/', {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include'
		});
		if (!response.ok) {
            // const error = await response.json();
			// if (response.status === 400) {
			// 	//check correct error codes
			// 	errormsg("Internal error, try again later", "t-modal-errormsg");
			// }
            throw new Error('Could not get tournament list');
        }
		const responseData = await response.json();
        if (responseData !== null) {
            console.log(`User log: GET TOURNAMENTS SUCCESSFUL`);
            return responseData;
        } else {
            throw new Error('No response from server');
        }
	}
	catch (e){
		// errormsg(e.value, "t-modal-errormsg");
		console.log('User log: GET TOURNAMENTS FAILED');
		throw new Error(e.message);
	}
}