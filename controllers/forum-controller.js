const db = require("../db");

exports.getForumPage = (req, res) => {
  res.redirect("/forum/unsafe-space");
};

exports.getForumTopic = (req, res) => {
  const topic = req.params.topic;
  if (topic === "unsafe-space") {
    res.render("forum", {
      pageTitle: "Forum",
      path: "/forum",
      topic
    });
  } else if (topic == "playground") {
    // db.all("SELECT * FROM posts ORDER BY RANDOM() LIMIT 5", [], (err, rows) => {
    db.all("SELECT * FROM posts where is_safe=0 ORDER BY creation_date desc LIMIT 10", [], (err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
      res.render("forum", {
        pageTitle: "Forum",
        path: "/forum",
        topic,
        unsafePosts: rows
      });
    });
  } else if (topic == "safe-space") {
    db.all("SELECT * FROM posts where is_safe=1 ORDER BY creation_date desc LIMIT 10", [], (err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
      res.render("forum", {
        pageTitle: "Forum",
        path: "/forum",
        topic,
        safePosts: rows
      });
    }); 
  } else if (topic == "bank-forum") {
    db.all("SELECT * FROM posts where is_bank_post=1 ORDER BY creation_date desc LIMIT 10", [], (err, rows) => {
      if (err) {
        console.log("error on 45")
        console.error(err.message);
        return;
      }
      res.render("forum", {
        pageTitle: "Forum",
        path: "/forum",
        topic,
        bankPosts: rows 
      });
    }); 
  }
}

exports.getAttackPage = (req, res) => {
  res.render("forum-trap.ejs", {
    attacker: req.params.attacker
  })
}

exports.addUnsafePost = (req, res) => {
  db.run("INSERT OR IGNORE INTO posts (user_id, username, content, is_safe) VALUES (?, ?, ?, ?)", [
    req.user.id,
    req.user.username,
    req.body.postContent,
    0
  ])
  res.redirect("/forum/playground");
}

exports.addSafePost = (req, res) => {
  db.run("INSERT OR IGNORE INTO posts (user_id, username, content, is_safe) VALUES (?, ?, ?, ?)", [
    req.user.id,
    req.user.username,
    req.body.postContent,
    1
  ])
  res.redirect("/forum/safe-space");
}

exports.addBankPost = (req, res) => {
  console.log(req.user, 85);
  console.log(req.body);
  db.run("INSERT OR IGNORE INTO posts (user_id, username, content, is_safe, is_bank_post) VALUES (?, ?, ?, ?, ?)", [
    req.user.id,
    req.user.username,
    req.body.postContent,
    2,
    1
  ])
  res.redirect("/forum/bank-forum");
}

