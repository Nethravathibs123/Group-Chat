async function handleLogin(event){
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if (!email || !password) {
      const div = document.getElementById('mydiv');
      div.innerHTML = `<p style="color: red;">Please fill in both email and password.</p>`;
      return;
  }

  const user = {
      email: email,
      password: password
  };

  try {
      const response = await axios.post("http://localhost:3000/login", user);
      console.log(response.data);
      sessionStorage.setItem('token', response.data.token);

      window.location.href = "/chat.html";
  } catch (error) {
      console.error("Error during login:", error);

      const div = document.getElementById('mydiv');
      if (error.response) {
          div.innerHTML = `<p style="color: red;">${error.response.data?.message || "An error occurred. Please try again."}</p>`;
      } else {
          div.innerHTML = `<p style="color: red;">Network error or server is down. Please try again later.</p>`;
      }
  }
}
