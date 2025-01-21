async function handleSubmit(e)
{
    e.preventDefault();
    const name=document.getElementById("name").value;
    const email=document.getElementById('email').value;
    const phone=document.getElementById('phone').value;
    const password=document.getElementById('password').value;

    const user={
        name:name,
        email:email,
        phone:phone,
        password:password
    }
console.log(user);
try{
    const response=await axios.post('http://localhost:3000/signup',user)
    console.log(response.data);
        if (response.status === 201) {
            alert("Successfully signed up!");   
        } else {
            throw new Error(response.data.message || 'Sign up failed.');
        }
    }
catch(error){
    console.error("Error details:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Status code:", error.response.status);

            if (error.response.status === 409) {
                alert("User already exists, Please Login");
            } else {
                alert(error.response.data.message || "An unexpected error occurred.");
            }
        } else {
            alert("An error occurred during signup. Please try again.");
        }
    }
}