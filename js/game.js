import {
    getWordsDifficulty,
    getGameSettings
} from "./data.js";

import {
    addCurrency,
    updateBestScore,
    addRanking,
    saveUserData
} from "./storage.js";

import {
    generateQuestion
} from "./question.js";

import {
    showGameScreen,
    showResultScreen,
    renderQuestion,
    updateScore,
    showFinalScore,
    showCorrectAnswer,
    showWrongAnswer,
    showEarnedCurrency,
    disableAnswerButtons,
    getAnswerButtons
} from "./ui.js";

import {
    startTimer,
    stopTimer
} from "./timer.js";

//상태 변수
let gameRunning = false;
let selectedDifficulty = null;
let currentWords = [];
let usedWords = [];
let currentQuestion = null;
let score = 0;
let combo = 0;

//게임 시작
export function startGame(difficulty) {
    selectedDifficulty = difficulty;
    currentWords = getWordsDifficulty(selectedDifficulty);
    //난이도 단어가 4개 이하인 경우 예외 처리
    if (currentWords.length < 4) {
        alert("문제 생성을 위한 단어가 부족합니다");
        return false;
    }
    score = 0;
    combo = 0;
    usedWords = [];
    updateScore(score);
    gameRunning = true;
    showGameScreen();
    createNextQuestion();
    console.log("게임 시작 :", selectedDifficulty);
    return true;
}

//다음 문제 생성
export function createNextQuestion() {
    if (!gameRunning) { return; }
    const unusedWords = currentWords.filter(word => !usedWords.includes(word.id));

    if (unusedWords.length === 0) {
        gameOver("모든 단어 출제 완료");
        return;
    }

    const randomIndex = Math.floor(Math.random() * unusedWords.length);
    const correctWord = unusedWords[randomIndex];

    usedWords.push(correctWord.id);

    currentQuestion = generateQuestion(currentWords, correctWord);

    renderQuestion(currentQuestion);

    const settings = getGameSettings();

    const decreaseCount = Math.max(0, combo - settings.decreaseStartCount);
    const timeLimit = Math.max(
        settings.minimumTime,
        settings.initialTime - (decreaseCount * settings.decreaseAmount)
    );
    console.log("현재 콤보 :", combo);
    console.log("이번 문제 제한시간 :", timeLimit);
    startTimer(() => gameOver("시간이 종료됨"), timeLimit);
}

//정답 처리
export function handleAnswer(button) {
    if (!gameRunning || button.disabled) { return; }
    const selectedAnswer = button.dataset.answer;
    if (selectedAnswer === currentQuestion.correctAnswer) {
        console.log("정답");
        showCorrectAnswer(button);
        score++;
        combo++;
        updateScore(score);
        console.log("점수 :", score);
        console.log("연속 정답 :", combo);
        disableAnswerButtons();

        setTimeout(() => {
            if (!isGameRunning) { return; }
            createNextQuestion();
        }, 300);
    }
    else {
        console.log("오답");
        disableAnswerButtons();
        showWrongAnswer(button);
        const answerButtons = getAnswerButtons();
        answerButtons.forEach(answerButton => {
            if (answerButton.dataset.answer === currentQuestion.correctAnswer) {
                showCorrectAnswer(answerButton);
            }
        });
        setTimeout(() => { gameOver("오답 선택"); }, 300);
    }
}

//게임 종료
export async function gameOver(reason = "게임 종료") {
    if (!gameRunning) { return; }
    gameRunning = false;
    stopTimer();
    disableAnswerButtons();
    console.log("게임 종료 :", reason);
    console.log("최종 점수 :", score);

    const difficultyMultiplier = { "초급": 1, "중급": 2, "고급": 3 }[selectedDifficulty] || 1;

    const earnedCurrency = score * difficultyMultiplier;
    addCurrency(earnedCurrency);
    updateBestScore(score);
    addRanking(score, selectedDifficulty);
    showFinalScore(score);
    showEarnedCurrency(earnedCurrency);
    showResultScreen();
    saveUserData();
}

//현재 점수 가져오기
export function getScore() {
    return score;
}

//게임 상태 확인
export function isGameRunning() {
    return gameRunning;
}

//현재 문제 가져오기
export function getCurrentQuestion() {
    return currentQuestion;
}

//현재 난이도 가져오기
export function getSelectedDifficulty() {
    return selectedDifficulty;
}
//버튼 연결
export function initGameEvents() {
    const answerButtons = getAnswerButtons();
    answerButtons.forEach(button => {
        button.addEventListener("click", () =>
            handleAnswer(button));
    });
}