//First we get variables existing.
//Then we load high scores
//Then we wait for start button to be pressed.
//Then we iterate through questions
//On every wrong question 5 sec are subtracted from timer
//Game ends when you get through questions, or time ends.

//initialize variables
var wins = 0;
var losses = 0;
var highScore;
var questionsAsked = 0;
var timeLeft = 90;
var curCorrect;
var tenthsOfSeconds = 0;

//show time to complete in seconds.
$(".timer").text(timeLeft);

//get high score and initials
var best = JSON.parse(localStorage.getItem("bestAndInitials"));

//Init basic high score variables
if (!best) {
    best = {
        initials: "",
        highScore: 0
    }
    $(".highscore").text("0")
} else {
    //Or render them if they exist
    $(".highscore").text(best.initials + " " + best.highScore)
}

//questions list
var questionsAndAnswers = [
    q1 = {
        question: "What is a div?",
        answers: ["A kind of scope", "when you want to divide elements",
            "A generic HTML tag", "When you make a mistake and want to div it away"],
        correctAnswer: "A generic HTML tag"
    },
    q2 = {
        question: "Which is not a primitive?",
        answers: ["Object", "Number", "String", "Boolean"],
        correctAnswer: "Object"
    },
    q3 = {
        question: "What is Truthiness?",
        answers: ["A variable that tells the truth", "A variable that is evaluated as true",
            "A variable that lies", "A boolean set to True"],
        correctAnswer: "A variable that is evaluated as true"
    },
    q4 = {
        question: "What is an if statement?",
        answers: ["A statement that asks a true or false question", "A statement that does something if you do something"],
        correctAnswer: "A statement that asks a true or false question"
    },
    q5 = {
        question: "What symbol is not used to represent a data type?",
        answers: ["{}", "[]", "||", "\"\""],
        correctAnswer: "||"
    },
    q6 = {
        question: "How many times can you invoke a single method?",
        answers: ["5", "10", "15", "infinite"],
        correctAnswer: "infinite"
    },
    q7 = {
        question: "Which is not a conventional HTML tag",
        answers: ["Canvas", "img", "div", "Spleen"],
        correctAnswer: "Spleen"
    },
    q8 = {
        question: "What symbol(s) are used to check exact equality",
        answers: [".equal()", "=", "==", "==="],
        correctAnswer: "==="
    },
    q9 = {
        question: "What does a function do when it is finished running, but has no return statement",
        answers: ["returns undefined", "returns null", "returns 0", "nothing"],
        correctAnswer: "returns undefined"
    },
    q10 = {
        question: "Which is evaluated as true?",
        answers: ["empty string", "an empty array", "the number 0"],
        correctAnswer: "an empty array"
    },
    //Last question is the "Ender"
    gameOver = {
        question: "GAME OVER",
        answers: [],
        correctAnswer: ""
    }
];

//Function that takes a thing from the questions array and makes buttons from it
//Also adds the question into the HTML
//And returns the correct answer.
function makeSomeSillyLittleButtons() {
    //set variables
    questionToGen = questionsAndAnswers[questionsAsked];
    question = questionToGen["question"]
    answers = questionToGen["answers"];
    correctAnswer = questionToGen["correctAnswer"];
    //set question text
    $(".WhereQuestionGoes").text(question)
    //makes buttons and append them.
    for (let i = 0; i < answers.length; i++) {
        var curAnswer = answers[i];
        var answerButton = $("<button>");
        answerButton.addClass("btn btn-secondary");
        answerButton.attr("type", "button");
        answerButton.attr("data-answer", curAnswer);
        answerButton.text(curAnswer);
        $(".buttons").append(answerButton);
    }
    //increment what question we are on
    questionsAsked++;
    //return the correct answer
    //this could be hashed for more security, but eh.
    return correctAnswer;
}

//Just deletes all the buttons, I thought this would take more code, but it didn't.
function deleteThoseSillyLittleButtons() {
    $(".buttons").empty()
}

//Saves score and initials
//initials must be 3 or fewer characters long.
//Also puts the high score and initials in the HTML
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

//deals with all button clicks
//either click the start button, clicking the right answer, or clicking the wrong answer.
//In that order.
$(".buttons").on("click", function (event) {
    console.log($(event.target).attr("data-answer"))
    //put set interval within here, to make things easier
    //Checks win condition 10 times a second now
    if ("startingButton" === $(event.target).attr("data-answer")) {
        deleteThoseSillyLittleButtons()
        curCorrect = makeSomeSillyLittleButtons()
        // var timerInterval;
        //within this need a counter that goes to 10.
        //when it's counted to 10, update timerInterval.
        var timerInterval = setInterval(function () {
            //increment tenths of seconds since this runs 10 times a second.
            tenthsOfSeconds++;
            //figure out when to increment the actualy interval
            if (tenthsOfSeconds === 9) {
                timeLeft--;
                tenthsOfSeconds = 0;
            }
            //render interval
            $(".timer").text(timeLeft);
            //Game over conditions
            if (questionsAsked > (questionsAndAnswers.length - 1) || (timeLeft <= 0)) {
                gameOverCondition(timerInterval, wins)
            }
        },
            //interval is .1 seconds
            100);
        //where things will end, and we update time left
        $(".timer").text(timeLeft)

        //these are our correct guess conditions
    } else if (curCorrect === $(event.target).attr("data-answer")) {
        //If we do good, we increment wins and set up buttons again
        wins++;
        $(".correct").text(wins);
        deleteThoseSillyLittleButtons();
        curCorrect = makeSomeSillyLittleButtons();
    } else {
        //subtract some time, but don't make it negative.
        //End timerInterval if it's going to be less than 0.
        if (timeLeft <= 5) {
            clearInterval(timerInterval);
            timeLeft = 0
        } else {
            timeLeft -= 5
        }
        $(".timer").text(timeLeft);
        //if we increment losses, and set up buttons again.
        losses++;
        $(".wrong").text(losses);
        deleteThoseSillyLittleButtons();
        curCorrect = makeSomeSillyLittleButtons();
    };
})

function gameOverCondition(timer, corrects) {
    clearInterval(timer);
    console.log("GAME OVER");
    deleteThoseSillyLittleButtons();
    $(".WhereQuestionGoes").text("GAME OVER");
    if (corrects > best.highScore) {
        saveScoreAndInitials()
    }
}

