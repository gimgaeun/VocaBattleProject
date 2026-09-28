import {
    getWordsDifficulty,
    getGameSettings
} from "./data.js";

import {
    addCurrency,
    updateBestScore,
    addRanking,
    getUserData,
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

//게임 진행 여부
let gameRunning = false;

//선택 난이도 저장
let selectedDifficulty = null;

//선택된 난이도 단어 저장
let currentWords = [];

//이미 출제된 단어 id 저장
let usedWords = [];

//현재 출제 문제 저장
let currentQuestion = null;

//현재 점수
let score = 0;

//현재 연속 정답 횟수
let combo = 0;

//게임 시작
export function startGame(difficulty) {
    //선택된 난이도 저장
    selectedDifficulty = difficulty;
    //난이도 단어 가져오기
    currentWords =
        getWordsDifficulty(
            selectedDifficulty
        );
    //난이도 단어가 4개 이하인 경우
    if (currentWords.length < 4) {
        alert("문제 생성을 위한 단어 부족");
        return false;
    }
    //초기화
    score = 0;
    combo = 0;
    usedWords = [];
    updateScore(score);
    //게임 상태 변경
    gameRunning = true;
    //게임 화면 표시
    showGameScreen();
    //첫문제 생성
    createNextQuestion();
    console.log(
        "게임 시작 :",
        selectedDifficulty
    );
    //게임 시작 성공
    return true;
}

//다음 문제 생성
export function createNextQuestion() {
    // 게임이 진행 중이 아니라면
    // 새로운 문제를 만들지 않는다.
    if (!gameRunning) {
        return;
    }
    //출제되지 않은 단어 확인
    const unusedWords =
        currentWords.filter(
            word =>
                !usedWords.includes(word.id)
        );
    //모든 단어 사용한 경우
    if (unusedWords.length === 0) {
        gameOver(
            "모든 단어 출제 완료"
        );
        return;
    }
    //정답 단어 랜덤 선택
    const randomIndex =
        Math.floor(
            Math.random() * unusedWords.length
        );
    const correctWord =
        unusedWords[randomIndex];
    //출제기록 저장
    usedWords.push(
        correctWord.id
    );
    //문제생성
    currentQuestion =
        generateQuestion(
            currentWords,
            correctWord
        );
    //문제 화면 출력
    renderQuestion(
        currentQuestion
    );
    //설정 가져오기
    const settings =
        getGameSettings();
    console.log(
        "settings 확인:",
        settings
    );
    //제한 시간 계산
    const decreaseCount =
        Math.max(
            0,
            combo - settings.decreaseStartCount
        );
    const timeLimit =
        Math.max(
            settings.minimumTime,
            settings.initialTime -
            (
                decreaseCount *
                settings.decreaseAmount
            )
        );
    console.log(
        "현재 콤보 :",
        combo
    );
    console.log(
        "이번 문제 제한시간 :",
        timeLimit
    );
    //타이머 시작
    startTimer(
        () => {
            gameOver(
                "시간이 종료됨"
            );
        },
        timeLimit
    );
}

//정답 처리
export function handleAnswer(button) {
    //게임이 끝난 경우
    if (!gameRunning) {
        return;
    }
    //비활성화 버튼 확인
    if (button.disabled) {
        return;
    }
    //사용자가 선택한 답
    const selectedAnswer =
        button.dataset.answer;
    //정답인지 확인
    if (selectedAnswer === currentQuestion.correctAnswer) {
        console.log("정답");
        //버튼 정답 스타일로 번경
        showCorrectAnswer(button);
        //점수 +1
        score++;
        //연속 정답 +1
        combo++;
        //화면 점수 업데이트
        updateScore(score);
        console.log("점수 :", score);
        console.log("연속 정답 :", combo);
        //정답 버튼 비활성화
        disableAnswerButtons();
        //0.3초 후 다음문제 출제
        setTimeout(() => {
            if (!gameRunning) {
                return;
            }
            createNextQuestion();
        }, 300);
    }
    //오답 처리
    else {
        console.log("오답");
        //버튼 오답 스타일 변경
        showWrongAnswer(button);
        //정답도 표시함
        answerButtons.forEach(answerButton => {
            if (
                answerButton.dataset.answer ===
                currentQuestion.correctAnswer
            ) {
                showCorrectAnswer(answerButton);
            }
        });
        //게임 종료
        setTimeout(() => {
            gameOver(
                "오답 선택"
            );
        }, 500);
    }
}

//게임 종료
export async function gameOver(reason = "게임 종료") {
    //게임이 끝난 경우
    if (!gameRunning) {
        return;
    }
    //게임 상태 변경
    gameRunning = false;
    //타이머 정지
    stopTimer();
    //정답 버튼 비활성화
    disableAnswerButtons();
    console.log("게임 종료 :", reason);
    console.log("최종 점수 :", score);
    //재화 비율
    let difficultyMultiplier = 1;
    if (selectedDifficulty === "초급") {
        difficultyMultiplier = 1;
    } else if (selectedDifficulty === "중급") {
        difficultyMultiplier = 2;
    } else if (selectedDifficulty === "고급") {
        difficultyMultiplier = 3;
    }
    //재화 계산
    const earnedCurrency =
        score * difficultyMultiplier;
    //재화 추가
    addCurrency(earnedCurrency);
    //최고 점수 갱신
    updateBestScore(score);
    //랭킹 추가
    addRanking(score, selectedDifficulty);
    //결과 화면 점수 표시
    showFinalScore(score);
    //결과 화면 획득 재화 표시
    showEarnedCurrency(earnedCurrency);
    //결과 화면
    showResultScreen();
    //사용자 데이터 저장
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
const answerButtons = getAnswerButtons();
answerButtons.forEach(button => {
    button.addEventListener("click", () => {
        handleAnswer(button);
    });
});