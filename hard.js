"use strict";

document.addEventListener("DOMContentLoaded", function() {
    initializeGame();
    promptSpaceKey();
});

const questions = ["tkinter", "invert", "absolutely", "island", "label",
    "window", "event", "grid", "place", "Application", "white",
    "circus", "tigger", "muscle", "aptitude", "nothing", "javascript",
    "jojo","apple","orange","cherry","grapes","sugar","intersection","automobile",
    "train","airplane","fish","cat","dog","turtle","goldfish","book",
    "magazine","newspaper","telephone","mobile","lantern"];
let usedQuestions = [];
let score = 0;
let misstype = 0;
let currentQuestion = "";
let previousAnswer = "";
let startTime;

function initializeGame() {
    document.getElementById("answer").addEventListener("input", handleInput);
    document.getElementById("answer").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });
    document.getElementById("pauseDown").addEventListener("click", pauseDownTimer);
    document.getElementById("resumeDown").addEventListener("click", resumeDownTimer);

    document.getElementById("answer").style.display = "none";
    document.getElementById("question").style.display = "none";
    document.getElementById("downTimer").style.display = "none";
    document.getElementById("startDown").style.display = "none";
    document.getElementById("pauseDown").style.display = "none";
    document.getElementById("resumeDown").style.display = "none";
    document.getElementById("topDuringPause").style.display = "none";
    document.getElementById("gameResult").style.display = "none";

    document.getElementById("playAgain").addEventListener("click", function() {
        window.location.reload();
    });

    document.getElementById("topAfterGame").addEventListener("click", function() {
        window.location.href = "Top.html"; 
    });

    document.getElementById("topDuringPause").addEventListener("click", function() {
        window.location.href = "Top.html";
    });
}

function promptSpaceKey() {
    window.addEventListener("keydown", function(event) {
        if (event.key === " ") {
            startCountdown();
        }
    }, { once: true });
}

function startCountdown() {
    document.getElementById("spaceKeyPrompt").style.display = "none";
    let countdown = 3;
    const countdownElement = document.getElementById("countdown");
    countdownElement.textContent = countdown;

    const countdownInterval = setInterval(function() {
        countdown--;
        if (countdown > 0) {
            countdownElement.textContent = countdown;
        } else {
            clearInterval(countdownInterval);
            countdownElement.style.display = "none";
            document.getElementById("question").style.display = "block";
            document.getElementById("answer").style.display = "block";
            document.getElementById("downTimer").style.display = "block";
            document.getElementById("startDown").style.display = "none";
            document.getElementById("pauseDown").style.display = "block";
            startDownTimer();
            startTime = new Date(); 
            nextQuestion();
        }
    }, 1000);
}

function nextQuestion() {
    if (questions.length === 0) {
        endGame();
        return;
    }

    let randomIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions.splice(randomIndex, 1)[0];
    usedQuestions.push(currentQuestion);

    document.getElementById("question").textContent = currentQuestion;
    document.getElementById("answer").value = "";
    document.getElementById("answer").focus();
    previousAnswer = "";
}

function checkAnswer() {
    const answer = document.getElementById("answer").value;
    if (answer === currentQuestion) {
        score++;
        document.getElementById("result").textContent = "正解!";
        document.getElementById("result").style.color = "red";
        if (score >= 10) {
            endGame();
        } else {
            nextQuestion();
        }
    } else {
        misstype++;
        document.getElementById("missnum").textContent = misstype;
    }
}

function handleInput() {
    const answerElem = document.getElementById("answer");
    const answer = answerElem.value;

    if (answer.length > previousAnswer.length) {
        const addedChar = answer.charAt(previousAnswer.length);
        if (addedChar !== currentQuestion.charAt(previousAnswer.length)) {
        
            misstype++;
            document.getElementById("missnum").textContent = misstype;
            answerElem.value = previousAnswer;
            return;
        }
    }

    let formattedQuestion = "";
    for (let i = 0; i < currentQuestion.length; i++) {
        if (i < answer.length && answer[i] === currentQuestion[i]) {
            formattedQuestion += `<span class="correct">${currentQuestion[i]}</span>`;
        } else {
            formattedQuestion += currentQuestion[i];
        }
    }
    document.getElementById("question").innerHTML = formattedQuestion;

    previousAnswer = answer;

    if (answer === currentQuestion) {
        score++;
        document.getElementById("result").textContent = "正解!";
        document.getElementById("result").style.color = "red";
        if (score >= 10) {
            endGame();
        } else {
            nextQuestion();
        }
    }
}


let downTimerInterval;
let downTimerSeconds = 60;
let isDownRunning = false;

function startDownTimer() {
    if (isDownRunning) return;
    isDownRunning = true;

    downTimerInterval = setInterval(function() {
        if (downTimerSeconds > 0) {
            downTimerSeconds--;
            displayDownTimer();
        } else {
            clearInterval(downTimerInterval);
            isDownRunning = false;
            document.getElementById('startDown').disabled = false;
            document.getElementById('pauseDown').disabled = true;
            endGame();
        }
    }, 1000);
    document.getElementById('answer').disabled = false;
}

function pauseDownTimer() {
    if (!isDownRunning) return; 
    clearInterval(downTimerInterval);
    isDownRunning = false; 

    document.getElementById('resumeDown').style.display = "block";
    document.getElementById('topDuringPause').style.display = "block";
    document.getElementById('pauseDown').style.display = "none";

    document.getElementById('answer').disabled = true;
    document.getElementById('answer').style.pointerEvents = 'none';
    document.getElementById('question').style.pointerEvents = 'none';
}

function resumeDownTimer() {
    if (isDownRunning) return; 

    isDownRunning = true; 

    downTimerInterval = setInterval(function() {
        if (downTimerSeconds > 0) {
            downTimerSeconds--;
            displayDownTimer(); 
        } else {
            clearInterval(downTimerInterval);
            isDownRunning = false;
            endGame();
        }
    }, 1000);

    document.getElementById('resumeDown').style.display = "none";
    document.getElementById('topDuringPause').style.display = "none";
    document.getElementById('pauseDown').style.display = "block";

    document.getElementById('answer').disabled = false;
    document.getElementById('answer').style.pointerEvents = 'auto';
    document.getElementById('question').style.pointerEvents = 'auto';
}


function displayDownTimer() {
    const minutes = Math.floor(downTimerSeconds / 60);
    const seconds = downTimerSeconds % 60;
    document.getElementById('downTimer').textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function endGame() {
    clearInterval(downTimerInterval);
    isDownRunning = false;

    const endTime = new Date();
    const elapsedTime = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    finalScore = Math.max(0, (score * 150) - (misstype * 30) - (elapsedTime * 1.5));
    let grade;
    if (finalScore >= 800) {
        grade = "S";
    } else if (finalScore >= 600) {
        grade = "A";
    } else if (finalScore >= 400) {
        grade = "B";
    } else if (finalScore >= 200) {
        grade = "C";
    } else {
        grade = "D";
    }

    document.getElementById("finalMissnum").textContent = `ミスタイプ数: ${misstype}`;
    document.getElementById("elapsedTime").textContent = `経過時間: ${minutes}分${seconds}秒`;
    document.getElementById("finalScore").textContent = `スコア: ${finalScore}`;
    document.getElementById("finalGrade").textContent = `${grade}`;
    if (grade === "S") {
        document.getElementById("finalGrade").style.color = "yellow";
    } else if (grade === "A") {
        document.getElementById("finalGrade").style.color = "blue";
    } else if (grade === "B") {
        document.getElementById("finalGrade").style.color = "green";
    } else if (grade === "C") {
        document.getElementById("finalGrade").style.color = "brown";
    } else {
        document.getElementById("finalGrade").style.color = "gray";
    }

    document.getElementById("question").style.display = "none";
    document.getElementById("answer").style.display = "none";
    document.getElementById("downTimer").style.display = "none";
    document.getElementById("pauseDown").style.display = "none";
    document.getElementById("misslabel").style.display = "none";
    document.getElementById("resumeDown").style.display = "none";
    document.getElementById("result").style.display = "none";
    document.getElementById("missnum").style.display = "none";
    
    document.getElementById("gameResult").style.display = "block";
    document.getElementById("topDuringPause").style.display = "none";
}

document.getElementById("playAgain").addEventListener("click", function() {
    window.location.reload(); 
});

document.getElementById("topAfterGame").addEventListener("click", function() {
    window.location.href = "Top.html"; 
});
