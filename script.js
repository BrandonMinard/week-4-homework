// first and foremost, create a div with a button that starts things
// also a timer.
// then that makes some kind of multiple choice prompt with a question
// when you answer the question, the next one comes up
// timer for timer has to be globally scoped to subtract when wrong answer is given
// have to have quite a few questions.
// make a generic prototype first

// so add and remove things from a div?
var wins = 0;
var losses = 0;
var highScore;
var questionsAsked = 0;
var timeLeft = 60;
var curCorrect;
var best = JSON.parse(localStorage.getItem("bestAndInitials"));

if (!best) {
    best = {
        initials: "",
        highScore: 0
    }
    $(".highscore").text(0)
} else {
    $(".highscore").text(best.initials + " " + best.highScore)
}

var questionsAndAnswers = [
    q1 = {
        question: "What is a div",
        answers: ["A kind of scope", "when you want to divide elements",
            "A generic HTML tag", "When you make a mistake and want to div it away"],
        correctAnswer: "A generic HTML tag"
    },
    q1 = {
        question: "What is a div2",
        answers: ["A kind of scope", "when you want to divide elements",
            "A generic HTML tag", "When you make a mistake and want to div it away"],
        correctAnswer: "A generic HTML tag"
    },
    q1 = {
        question: "What is a div3",
        answers: ["A kind of scope", "when you want to divide elements",
            "A generic HTML tag", "When you make a mistake and want to div it away"],
        correctAnswer: "A generic HTML tag"
    },
    q1 = {
        question: "What is a div4",
        answers: ["A kind of scope", "when you want to divide elements",
            "A generic HTML tag", "When you make a mistake and want to div it away"],
        correctAnswer: "A generic HTML tag"
    },


    //bad but, eh, it works
    gameOver = {
        question: "GAME OVER",
        answers: [],
        correctAnswer: ""
    }
];


//init


function makeSomeSillyLittleButtons() {
    questionToGen = questionsAndAnswers[questionsAsked];
    question = questionToGen["question"]
    answers = questionToGen["answers"];
    correctAnswer = questionToGen["correctAnswer"];
    $(".WhereQuestionGoes").text(question)
    for (let i = 0; i < answers.length; i++) {
        var curAnswer = answers[i];
        var answerButton = $("<button>");
        answerButton.addClass("btn btn-secondary");
        answerButton.attr("type", "button");
        answerButton.attr("data-answer", curAnswer);
        answerButton.text(curAnswer);
        $(".buttons").append(answerButton);
    }
    questionsAsked++;

    return correctAnswer;
}


function deleteThoseSillyLittleButtons() {
    $(".buttons").empty()
}

function setTime() {
    //showing the time we start at.
    $(".timer").text(timeLeft);
    var timerInterval = setInterval(function () {
        timeLeft--;
        console.log(timeLeft + " seconds left");
        console.log(questionsAsked)
        console.log(questionsAndAnswers.length - 1)

        //showing the current time left.
        $(".timer").text(timeLeft);
        if (questionsAsked > (questionsAndAnswers.length - 1)) {
            clearInterval(timerInterval);
            console.log("GAME OVER");
            deleteThoseSillyLittleButtons();
            $(".WhereQuestionGoes").text("GAME OVER");
            if (wins > best.highScore) {
                saveScoreAndInitials()
            }
        } else if (timeLeft === 0) {
            clearInterval(timerInterval);
            console.log("GAME OVER");
            deleteThoseSillyLittleButtons();
            $(".WhereQuestionGoes").text("GAME OVER");
            if (wins > best.highScore) {
                saveScoreAndInitials()
            }
        }
    }, 1000);

}

function saveScoreAndInitials() {
    console.log("high score!")
    var initials = prompt("You got a highScore please input your initials if you'd like to save it!\n Only allowed a max of 3 initials")
    while (initials.length > 3) {
        alert("Try inputting initials again")
        initials = prompt("You got a highScore please input your initials if you'd like to save it!\n Only allowed a max of 3 initials")
    }
    best.highScore = wins
    best.initials = initials;
    localStorage.setItem("bestAndInitials", JSON.stringify(best));
    $(".highscore").text(best.initials + " " + best.highScore);
}

//Gets data-answer from a button.
$(".buttons").on("click", function (event) {
    console.log($(event.target).attr("data-answer"))
    if ("startingButton" === $(event.target).attr("data-answer")) {
        deleteThoseSillyLittleButtons()
        curCorrect = makeSomeSillyLittleButtons()
        setTime()
        $(".timer").text(timeLeft)
    } else if (curCorrect === $(event.target).attr("data-answer")) {
        wins++;
        $(".correct").text(wins);
        deleteThoseSillyLittleButtons();
        curCorrect = makeSomeSillyLittleButtons();
    } else {
        //subtract some time.
        timeLeft -= 10
        $(".timer").text(timeLeft);
        losses++;
        $(".wrong").text(losses);
        deleteThoseSillyLittleButtons();
        curCorrect = makeSomeSillyLittleButtons();
    };
})

