
exports.getLogInPage = (req, res) => {
    res.render("login", {
        pageTitle: "Log In",
        path: "login",
    })
}