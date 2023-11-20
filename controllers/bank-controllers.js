const db = require("../db");

exports.getBankPage = (req, res) => {
    db.get('SELECT * FROM users WHERE username = ?', [req.user.username], function (err, row) {
        res.render("bank", {
            pageTitle: "Bank",
            path: "/bank",
            name: req.user.username,
            balance: row.balance
        });
    });
}

exports.getTransaction = (req, res) => {
    const account = req.query.account
    const amount = parseInt(req.query.amount)
    if (req.user.username === account) {
        return res.redirect('/bank/failure?message=Cannot%20transfer%20to%20self');
    } else if (amount <= 0 || isNaN(amount)) {
        return res.redirect('/bank/failure?message=Enter%20valid%20amount');
    }
    db.run(
        'UPDATE users SET balance = balance - ? WHERE username = ? AND balance >= ?',
        [amount, req.user.username, amount],
        function (err) {
            if (err) {
                console.log(err.message);
                return res.redirect('/bank/failure?message=Server%20Error');
            } else if (this.changes === 0) {
                return res.redirect('/bank/failure?message=Low%20Balance');
            } else {
                db.run(
                    'UPDATE users SET balance = balance + ? WHERE username = ?',
                    [amount, account],
                    function (err) {
                        if (this.changes === 0 || err) {
                            if (err) {
                                return res.redirect('/bank/failure?message=Server%20Error');
                            } else {
                                db.run(
                                    'UPDATE users SET balance = balance + ? WHERE username = ?',
                                    [amount, req.user.username],
                                    function (err) {
                                        return res.redirect('/bank/failure?message=User%20does%20not%20exist');
                                    }
                                )
                            }
                        } else {
                            return res.redirect('/bank/success');
                        }
                    }
                );
            }
        }
    );
}

exports.postTransaction = (req, res) => {
    const account = req.body.account
    const amount = parseInt(req.body.amount)
    if (req.user.username === account) {
        return res.redirect('/bank/failure?message=Cannot%20transfer%20to%20self');
    } else if (amount <= 0 || isNaN(amount)) {
        return res.redirect('/bank/failure?message=Enter%20valid%20amount');
    }
    db.run(
        'UPDATE users SET balance = balance - ? WHERE username = ? AND balance >= ?',
        [amount, req.user.username, amount],
        function (err) {
            if (err) {
                console.log(err.message);
                return res.redirect('/bank/failure?message=Server%20Error');
            } else if (this.changes === 0) {
                return res.redirect('/bank/failure?message=Low%20Balance');
            } else {
                db.run(
                    'UPDATE users SET balance = balance + ? WHERE username = ?',
                    [amount, account],
                    function (err) {
                        if (this.changes === 0 || err) {
                            if (err) {
                                return res.redirect('/bank/failure?message=Server%20Error');
                            } else {
                                db.run(
                                    'UPDATE users SET balance = balance + ? WHERE username = ?',
                                    [amount, req.user.username],
                                    function (err) {
                                        return res.redirect('/bank/failure?message=User%20does%20not%20exist');
                                    }
                                )
                            }
                        } else {
                            return res.redirect('/bank/success');
                        }
                    }
                );
            }
        }
    );
}

exports.getSuccess = (req, res) => {
    res.render("success", {
        pageTitle: "Success",
        path: "/bank/success",
    });
}

exports.getFailure = (req, res) => {
    res.render("failure", {
        pageTitle: "Failure",
        path: "/bank/failure",
        message: req.query.message
    });
}   
