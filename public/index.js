const onRegister = async (event) => {
  event.preventDefault();

  const registerForm = event.target;
  const registerData = new FormData(registerForm);

  const username = registerData.get("username");
  const password = registerData.get("password");

  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  console.log(response);
};

(async () => {
  document.querySelector("#register").addEventListener("submit", onRegister);
})();
