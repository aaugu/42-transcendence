
export async function getUserInfo() {
    const token = localStorage.getItem('token');
	const decodedToken = jwt_decode(token);

	const url = 'https://localhost:10444/api/user/';
	await fetch(url + decodedToken.user_id + '/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
			// 'Authorization': `Bearer ${token}`,
        },
		credentials: 'include', //include the cookies like this
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.json();
            if (response.status === 401) {
                if (error.detail) {
                    if (typeof(error.detail) == 'string')
                        errormsg(error.detail, "homepage-errormsg");
                    else
                        errormsg(error.detail[0], "homepage-errormsg");
                }
            }
            else if (response.status === 404) {
                if (error.detail) {
                    if (typeof(error.detail) == 'string')
                        errormsg(error.detail, "homepage-errormsg");
                    else
                        errormsg(error.detail[0], "homepage-errormsg");
                }
            }
            throw new Error(`HTTP status code ${response.status}`);
        }
        return response.json()
    })
    .then(responseData => {
            if (responseData !== null) {
                console.log(JSON.stringify(responseData));
                console.log("User log: GET USER INFO SUCCESSFUL");
                return { success: true, data: responseData };
            }
    })
    .catch(e => {
        console.error('User log: GET USER INFO FETCH FAILURE, '+ e);
        return { success: false, error: e.message || "Fetch error" };
    });
}