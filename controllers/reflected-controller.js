function cleanseScriptTags(text) {
  if (text === undefined || text === null) return "";

  if (text.toLowerCase().includes("<script>")) {
    text = text.replace("<script>", "");
  }

  if (text.toLowerCase().includes("</script>")) {
    text = text.replace("</script>", "");
  }

  return text;
}

exports.checkAnswer = (req, res) => {
  var answer = req.body.answer;

  print(answer)
}

exports.getVotePage = (req, res) => {
  var vote = req.query.vote;

  vote = cleanseScriptTags(vote);

  res.render("vote", {
    pageTitle: "vote",
    path: "/vote",
    vote: vote,
  });
};
