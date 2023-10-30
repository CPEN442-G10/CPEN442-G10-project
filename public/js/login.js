
window.onload = () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const loginToggle = document.getElementById("login-toggle");
    const signupToggle = document.getElementById("signup-toggle");

    signupForm.style.display = "none";

    loginToggle.onclick = (e) => {
        e.preventDefault();
        signupForm.style.display = "none";
        loginForm.style.display = "block";
    };

    signupToggle.onclick = (e) => {
        e.preventDefault();
        signupForm.style.display = "block";
        loginForm.style.display = "none";
    };

};
