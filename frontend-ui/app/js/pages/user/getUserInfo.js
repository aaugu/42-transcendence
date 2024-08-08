async function getUserInfo() {
    const token = localStorage.getItem("token");
    await fetch('api/user/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.json();
            if (response.status === 401) {
                if (error.detail) {
                    if (typeof(error.detail) == 'string')
                        errormsg(error.detail);
                    else
                        errormsg(error.detail[0]);
                }
            }
            else if (response.status === 404) {
                if (error.detail) {
                    if (typeof(error.detail) == 'string')
                        errormsg(error.detail);
                    else
                        errormsg(error.detail[0]);
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
                return responseData;
            }
    })
    .catch(e => {
        console.error('User log: GET USER INFO FETCH FAILURE, '+ e);
        return null;
    });
}