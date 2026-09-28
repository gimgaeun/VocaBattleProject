//화면 요소
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");
const rankingScreen = document.getElementById("ranking-screen");

//UI 요소
const questionWord = document.getElementById("question-word");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const fallingArea = document.getElementById("falling-area");
const answerButtons = document.querySelectorAll(".answer-btn");

//결과 및 메인 화면 요소
const finalScore = document.getElementById("final-score");
const earnedCurrency = document.getElementById("earned-currency")
const currencyElement = document.getElementById("currency");

//화면 전환
export function showScreen(screen) {
    //모든 화면 숨김
    startScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    rankingScreen.classList.add("hidden");
    //대상 화면만 표시
    screen.classList.remove("hidden");
}

//시작 화면 표시
export function showStartScreen() {
    showScreen(startScreen);
}

//게임 화면 표시
export function showGameScreen() {
    showScreen(gameScreen);
}

//결과 화면 표시
export function showResultScreen() {
    showScreen(resultScreen);
}

//랭킹 화면 표시
export function showRankingScreen() {
    showScreen(rankingScreen);
}

//문제, 선택지 표시
export function renderQuestion(question) {
    questionWord.textContent = question.question;
    question.choices.forEach((choice, index) => {
        const button = answerButtons[index];
        button.textContent = choice.word;
        button.dataset.answer = choice.word;
        button.classList.remove("correct", "wrong");
        button.disabled = false;
        button.style.top = "0px";

        //단어 길이에 따른 글자 크기 조절
        const wordLength = choice.word.length;
        if (wordLength <= 8) {
            button.style.fontSize = "24px";
        } else if (wordLength <= 10) {
            button.style.fontSize = "20px";
        } else if (wordLength <= 12) {
            button.style.fontSize = "15px";
        } else {
            button.style.fontSize = "14px";
        }
    });
}

//점수 업데이트
export function updateScore(score) {
    scoreElement.textContent = score;
}

//남은 시간 업데이트
export function updateTimer(time) {
    timerElement.textContent = Number(time).toFixed(1);
}

//시간 부족 경고
export function setTimerWarning(isWarning) {
    if (isWarning) {
        timerElement.classList.add("warning");
    } else {
        timerElement.classList.remove("warning");
    }
}

//정답 버튼
export function getAnswerButtons() {
    return answerButtons;
}

//떨어지는 영역
export function getFallingArea() {
    return fallingArea;
}

//정답 버튼 위치 이동
export function setAnswerPosition(position) {
    answerButtons.forEach(button => {
        button.style.top = `${position}px`;
    });
}

//정답 버튼 비활성화
export function disableAnswerButtons() {
    answerButtons.forEach(button => {
        button.disabled = true;
    });
}

//정답 버튼 활성화
export function enableAnswerButtons() {
    answerButtons.forEach(button => {
        button.disabled = false;
    });
}

//정답 버튼 -> 정답 상태
export function showCorrectAnswer(button) {
    button.classList.add("correct");
}

//오답 버튼 -> 오답 상태
export function showWrongAnswer(button) {
    button.classList.add("wrong");
}

//최종 점수 표시
export function showFinalScore(score) {
    if (finalScore) {
        finalScore.textContent = score;
    }
}

//획득 재화 표시
export function showEarnedCurrency(amount) {
    if (earnedCurrency) {
        earnedCurrency.textContent = amount;
    }
}

// 보유 재화 표시
export function updateCurrency(currency) {
    if (currencyElement) {
        currencyElement.textContent = currency;
    }
}