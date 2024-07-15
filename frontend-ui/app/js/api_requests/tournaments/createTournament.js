const options = {
	method: 'POST',
	headers: {
	  'Content-Type': 'application/json'
	},
	body: JSON.stringify({
	  title: 'My First Request',
	  body: 'This is the body of my first blog post.'
	})
  };

export function getTournaments() {
    fetch('https://172.20.0.2/api/tournaments', options)
    .then(response => {
        if ( !response.ok ) {
            throw new Error(`HTTP error! status: ${reponse.status}`);
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));

};