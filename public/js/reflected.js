window.onload = () => {
  introJs().addHints();
  introJs().setOption("dontShowAgain", true).start();

  const resetButton = document.getElementById("reset-form");

  resetButton.onclick = (e) => {
    e.preventDefault();
    location.href = "/vote";
  };
};
