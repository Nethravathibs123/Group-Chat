async function handleLogin(e){
    e.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
   
    const user={
       email:email,
       password:password
    }
       try{
   const response= await axios.post("http://localhost:3000/login",user)
   
   console.log(response.data);
   sessionStorage.setItem('token',r.data.token);
   window.location.href="http://localhost:3000/Frontend/chat.html"
    } catch (error) {
      console.error("Error during login:", error);
      console.error("Error response:", error.response);
      const div = document.getElementById('mydiv');
      div.innerHTML = `<p style="color: red;">${error.response?.data?.message || "An error occurred. Please try again."}</p>`;
  }
}