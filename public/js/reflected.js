window.onload = () => {
  const resetButton = document.getElementById("reset-form");

  resetButton.onclick = (e) => {
    e.preventDefault();
    location.href = "/vote/"
  }
}