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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
    require("openurl").open(`http://localhost:${PORT}`);
});
