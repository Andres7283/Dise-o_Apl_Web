$(document).ready(function () {
  function ocultar() {
    const btnCookie = document.getElementById("btnCookie");
    btnCookie.addEventListener("click", (e) => {
      btnCookie.parentElement.remove();
    });
  }
  ocultar();
});
