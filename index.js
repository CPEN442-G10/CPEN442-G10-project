const express = require("express");
const path = require("path");
const app = express();
const loginRouter = require("./routes/login-routes");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.get("/hello", (req, res) => {
    res.send("hello world!");
});

app.use(loginRouter);

app.listen(3000);
