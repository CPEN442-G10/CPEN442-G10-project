window.onload = function () {
    if (progressNum == 0) {
        startIntro();
    } else if (progressNum == 1) {
        showDropTableHint();
    } else if (progressNum == 2) {
        showCongratulations();
    }
};

function startIntro() {
    introJs().setOptions({
        steps: [{
            intro: "Welcome to the SQL Injection module! Let's start by finding hidden merchandise."
        }, {
            element: document.querySelector('#searchBox'),
            intro: "Try searching for a product using SQL injection here."
        }]
    }).start();
}

function showDropTableHint() {
    introJs().setOptions({
        steps: [{
            intro: "Great job! Now, let's see if you can drop the table using a new SQL injection."
        }, {
            element: document.querySelector('#searchBox'),
            intro: "Try dropping the table by injecting a DROP TABLE command."
        }]
    }).start();
}

function showCongratulations() {
    introJs().setOptions({
        steps: [{
            intro: "Congratulations! You have successfully completed the task. <a href='/sql-injection/knowledge'>Learn More</a>"
        }],
        doneLabel: 'Done'
    }).start();
}