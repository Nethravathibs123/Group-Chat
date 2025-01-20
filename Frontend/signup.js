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
            messageParagraph.textContent = 'Sign up successful!';
            messageParagraph.style.color = 'green';
        } else {
            throw new Error(response.data.message || 'Sign up failed.');
        }
    }
catch(error){
    alert("User already Exist")
}
}