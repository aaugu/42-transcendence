export async function getUsers() {
	try {
        const response = await fetch('https://localhost:10443/api/user/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            if (response.status === 401 || response.status === 404) {
                if (error.detail) {
                    throw new Error (error.detail);
                }
            }
            throw new Error('Could not get all users');
        }

        const responseData = await response.json();
        if (responseData !== null) {
            console.log("USER LOG: GET USERS SUCCESSFUL");
            return responseData;
        }
    } catch (e) {
        console.error('USER LOG: GET USERS FETCH FAILURE, ' + e.message);
        throw new Error(e.message);
    }
}