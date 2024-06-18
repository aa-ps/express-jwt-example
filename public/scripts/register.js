const onRegister = async (event) => {
  event.preventDefault();

  const registerForm = event.target;
  const registerData = new FormData(registerForm);
  const errorMessage = document.getElementById("error");
  const username = registerData.get("username");
  const password = registerData.get("password");

  errorMessage.innerText = "";

  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  const { error } = await response.json();

  errorMessage.innerText = error;
};

(async () => {
  document.querySelector("#register").addEventListener("submit", onRegister);
})();
