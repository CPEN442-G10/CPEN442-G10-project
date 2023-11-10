exports.getForumPage = (req, res) => {
    res.render("forum", {
      pageTitle: "Forum",
      path: "/forum"
    });
}

