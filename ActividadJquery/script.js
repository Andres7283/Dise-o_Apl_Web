document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signup-form");
  const inputs = document.querySelectorAll(".input-field");
  const passwordField = document.getElementById("password");
  const togglePassword = document.querySelector(".toggle-password");
  const termsCheckbox = document.getElementById("terms");
  const submitBtn = document.getElementById("submit-btn");
  const successMessage = document.getElementById("success-message");

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (!this.value.trim()) {
        this.classList.add("error");
        this.nextElementSibling.style.display = "block";
      } else {
        this.classList.remove("error");
        this.nextElementSibling.style.display = "none";
      }
      checkFormValidity();
    });
  });

  togglePassword.addEventListener("click", function () {
    passwordField.type =
      passwordField.type === "password" ? "text" : "password";
  });

  termsCheckbox.addEventListener("change", checkFormValidity);

  function checkFormValidity() {
    const allFilled = [...inputs].every((input) => input.value.trim() !== "");
    submitBtn.disabled = !allFilled || !termsCheckbox.checked;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    form.style.display = "none";
    successMessage.classList.remove("hidden");
  });
});
