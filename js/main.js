import {
    loadWordData,
    loadGameSetting
} from "./data.js";

import {
    loadUserData,
    getUserData
} from "./storage.js";

import {
    initGameEvents,
    startGame
} from "./game.js";

import {
    showStartScreen,
    updateCurrency
} from "./ui.js";

import {
    showRanking
} from "./ranking.js";


let selectedDifficulty = null;

function setupEventListeners() {
    const difficultyButton = document.querySelectorAll(".difficulty-btn");
    const startButton = document.getElementById("start-btn");
    const rankingButton = document.getElementById("ranking-btn");
    const restartButton = document.getElementById("restart-btn");
    const homeButton = document.getElementById("home-btn");
    const rankingHomeButton = document.getElementById("ranking-home-btn");

    //난이도 선택
    difficultyButton.forEach(button => {
        button.addEventListener("click", () => {
            selectedDifficulty = button.dataset.difficulty;
            difficultyButton.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            console.log("선택된 난이도 :", selectedDifficulty);
        });
    });
    //게임 시작
    startButton.addEventListener("click", () => {
        if (!selectedDifficulty) {
            alert("난이도를 선택해주세요.");
            return;
        }
        startGame(selectedDifficulty);
    });

    //랭킹 화면
    rankingButton.addEventListener("click", () => {
        showRanking();
    });

    //다시 하기
    restartButton.addEventListener("click", () => {
        if (!selectedDifficulty) {
            showStartScreen();
            return;
        }
        startGame(selectedDifficulty);
    });

    //결과 화면 -> 메인
    homeButton.addEventListener("click", () => {
        const userData = getUserData();
        updateCurrency(userData.currency);
        showStartScreen();
    });

    //랭킹 -> 메인
    rankingHomeButton.addEventListener("click", () => {
        showStartScreen();
    });
}

//프로그램 초기화
async function initialization() {
    try {
        console.log("게임 시작");
        await loadWordData();
        await loadGameSetting();
        const userData = await loadUserData();
        setupEventListeners();
        initGameEvents();
        updateCurrency(userData.currency);
        console.log("게임 초기화 완료");
        showStartScreen();
    } catch (error) {
        console.error("초기화 중 오류 발생", error);
        alert("데이터를 불러오는 데 실패했습니다.");
    }
}

//프로그램 실행
initialization();