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

ANSWER_STATES = {
  INCORRECT: "incorrect",
  CORRECT: "correct",
  HAS_SCRIPT_TAG: "script",
  UNANSWERED: "unanswered",
};

ANSWER_SCRIPTS = [
  "http://localhost:3000/vote?vote=%3Cimg+src%3Dx+onerror%3Dsteal%28document.cookie%29%3E%3C%2Fimg%3E",
  "http://localhost:3000/vote?vote=%3Cimg+src%3Dx+onerror%3Dsteal%28document.cookie%29%2F%3E",
  "http://localhost:3000/vote?vote=<img src=x onerror=steal(document.cookie)></img>",
  "http://localhost:3000/vote?vote=<img src=x onerror=steal(document.cookie)/>",
];

exports.checkAnswer = (req, res) => {
  var answer = req.body.answer;
  var answer_status = ANSWER_STATES.UNANSWERED;

  for (ans of ANSWER_SCRIPTS) {
    if (answer === ans) {
      answer_status = ANSWER_STATES.CORRECT;
      break;
    } else {
      answer_status = ANSWER_STATES.INCORRECT;
    }
  }

  res.render("vote", {
    pageTitle: "vote",
    path: "/vote",
    vote: "",
    tried_script: false,
    answer_status: answer_status,
  });
};

exports.getVotePage = (req, res) => {
  var vote = req.query.vote || "";
  var cleansedVote = cleanseScriptTags(vote);

  res.render("vote", {
    pageTitle: "vote",
    path: "/vote",
    vote: cleansedVote,
    tried_script: cleansedVote != vote,
    answer_status: ANSWER_STATES.UNANSWERED,
  });
};
