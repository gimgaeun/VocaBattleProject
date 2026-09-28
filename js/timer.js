import {
    getGameSettings
} from "./data.js";

import {
    setTimerWarning,
    setAnswerPosition,
    updateTimer,
    getFallingArea
} from "./ui.js";

let timerId = null;
let animationId = null;
let remainingTime = 0;
let startTime = null;

//타이머 시작
export function startTimer(onTimeOver, timeLimit = null) {
    stopTimer();
    const settings = getGameSettings();
    remainingTime = timeLimit ?? settings.initialTime ?? 10;
    updateTimer(remainingTime);
    setTimerWarning(false);
    //카운트다운 시작
    timerId = setInterval(() => {
        remainingTime--;
        if (remainingTime < 0) {
            remainingTime = 0;
        }
        updateTimer(remainingTime);
        setTimerWarning(remainingTime <= 3);

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
    const fallingArea = getFallingArea();
    const areaHeight = fallingArea ? fallingArea.clientHeight : 500;
    const buttonHeight = 82;
    const maxPosition = areaHeight - buttonHeight;
    startTime = Date.now();
    function animate() {
        const passedTime = Date.now() - startTime;
        let progress = passedTime / (timeLimit * 1000);
        if (progress > 1) {
            progress = 1;
        }
        //제한시간에 맞춰 진행률 계산
        const fallingPosition = progress * maxPosition;
        setAnswerPosition(fallingPosition);
        if (progress < 1 && remainingTime > 0) {
            animationId = requestAnimationFrame(animate);
        }
    }
    animationId = requestAnimationFrame(animate);
}

//낙하 정지
export function stopFalling() {
    if (animationId != null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

//남은 시간 가져오기
export function getRemainingTime() {
    return remainingTime;
}