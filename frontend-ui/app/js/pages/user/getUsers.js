export async function getUsers() {
	try {
        const response = await fetch('https://localhost:10444/api/user/', {
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
            console.log("User log: GET USERS SUCCESSFUL");
            return responseData;
        } else {
            throw new Error('No response from server');
        }
    } catch (e) {
        console.error('User log: GET USERS FETCH FAILURE, ' + e.message);
        throw new Error(e.message);
    }
}