import {
    getGameSettings
} from "./data.js";

import {
    updateScore,
    setTimerWarning,
    setAnswerPosition,
    updateTimer
} from "./ui.js";

//타이머 아이디
let timerId = null;

//버튼 낙하 애니메이션 아이디
let animationId = null;

//현재 남은 시간
let remainingTime = 0;

//답변 버튼 현재 위치
let fallingPosition = 0;

//이전 애니메이션 시간
let lastTimestamp = null;

//타이머 시작
export function startTimer(onTimeOver, timeLimit = null) {
    //기존 타이머 정지
    stopTimer();
    //게임 설정 가져오기
    const settings = getGameSettings();
    //문제 제한 시간 설정
    remainingTime =
        timeLimit ?? settings.initialTime ?? 10;
    //초기화
    fallingPosition = 0;
    lastTimestamp = null;
    updateTimer(remainingTime);
    setTimerWarning(false);
    //카운트다운 시작
    timerId = setInterval(() => {
        remainingTime--;
        if (remainingTime < 0) {
            remainingTime = 0;
        }
        updateTimer(remainingTime);
        //3초이하인지 확인
        setTimerWarning(remainingTime <= 3);
        //시간이 끝났는지 확인
        if (remainingTime <= 0) {
            stopTimer();
            if (onTimeOver) {
                onTimeOver();
            }
        }
    }, 1000);
    startFalling(remainingTime);
}

//타이머 정지
export function stopTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
    stopFalling();
}

//버튼 낙하
export function startFalling(timeLimit) {
    stopFalling();
    //초기화
    fallingPosition = 0;
    lastTimestamp = null;
    const fallingArea = document.getElementById("falling-area");
    const areaHeight = fallingArea.clientHeight;
    const buttonHeight = 82;
    // 버튼이 바닥에 도착할 수 있는 최대 위치
    const maxPosition =
        areaHeight - buttonHeight;
    //애니메이션
    function animate(timestamp) {
        if (lastTimestamp === null) {
            lastTimestamp = timestamp;
        }
        const elapsed =
            timestamp - lastTimestamp;
        //제한시간에 맞춰 진행률 계산
        fallingPosition +=
            (elapsed / (timeLimit * 1000))
            * maxPosition;
        //바닥을 넘어가지 않도록 제한
        if (fallingPosition > maxPosition) {
            fallingPosition = maxPosition;
        }
        setAnswerPosition(fallingPosition);
        lastTimestamp = timestamp;
        animationId =
            requestAnimationFrame(animate);
    }
    animationId =
        requestAnimationFrame(animate);
}

//낙하 정지
export function stopFalling() {
    if (animationId != null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    lastTimestamp = null;
}

//남은 시간 가져오기
export function getRemaingTime() {
    return remainingTime;
}