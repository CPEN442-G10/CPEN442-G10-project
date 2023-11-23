exports.getHomePage = (req, res) => {
    res.render("home", {
        pageTitle: "Home",
        path: "/home"
    })
}