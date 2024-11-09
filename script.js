// Listening when our DOM content is loaded
document.addEventListener('DOMContentLoaded', () =>{
    const registerForm = document.getElementById(signupform);
    // Listens to the submitted event
    registerForm.addEventListener('submit', async(e) =>{
        e.preventDefault();

        // Declaring variables
        const formData = new FormData(signupform);

        //Fetch parameters from our form
        const username = formData.get('username');
        const password = formData.get('password');
        const email = formData.get('email');
        const full_name = formData.get('full_name');

        // Push the parameters to our route in a try catch block to minimize errors
        try{
            const response = await fetch ('/signup', {
                method: 'POST',
                headers: {
                    // Passing data as json data
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, full_name })
            });
            // check if it is okay
            if(response.ok){
                alert('Signed up successfully');
            }else{
                alert('Registration Failed');
            }
        }catch(error){
            console.error('Error:', error);
            alert('An error occurred');
        }
    });
    
});