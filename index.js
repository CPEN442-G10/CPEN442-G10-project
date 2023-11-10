const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
var passport = require('passport');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
const {router: authRouter} = require("./routes/auth-routes");
const forumRouter = require("./routes/forum-routes");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './db' }),
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 1000*60*5,
  }
}));
app.use(passport.authenticate('session'));


app.use('/', authRouter);
app.use('/', forumRouter)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
    // require("openurl").open(`http://localhost:${PORT}`);
});
