import {
    loadWordData,
    loadGameSetting
} from "./data.js";

import {
    loadUserData,
    getUserData
} from "./storage.js";

import {
    startGame
} from "./game.js";

import {
    showStartScreen,
    updateCurrency
} from "./ui.js";

import {
    showRanking
} from "./ranking.js";

//선택된 난이도
let selectedDifficulty = null;

//버튼 목록
const difficultyButton =
    document.querySelectorAll(
        ".difficulty-btn"
    );

//게임 시작 버튼
const startButton =
    document.getElementById(
        "start-btn"
    );

//랭킹 보기 버튼
const rankingButton =
    document.getElementById(
        "ranking-btn"
    );

//다시 하기 버튼
const restartButton =
    document.getElementById(
        "restart-btn"
    );

//결과->메인으로 버튼
const homeButton =
    document.getElementById(
        "home-btn"
    );

//랭킹->메인으로 버튼
const rankingHomeButton =
    document.getElementById(
        "ranking-home-btn"
    );

//난이도 선택
difficultyButton.forEach(button => {
    button.addEventListener(
        "click",
        () => {
            //선택한 난이도 저장
            selectedDifficulty =
                button.dataset.difficulty;
            //기존 선택지 삭제
            difficultyButton.forEach(
                btn => {
                    btn.classList.remove(
                        "selected"
                    );
                }
            );
            //현재 버튼 선택
            button.classList.add(
                "selected"
            );
            console.log(
                "선택된 난이도 :",
                selectedDifficulty
            );
        }
    );
});

//게임 시작
startButton.addEventListener(
    "click",
    () => {
        //난이도 선택 확인
        if (!selectedDifficulty) {
            alert(
                "난이도를 선택해주세요."
            );
            return;
        }
        //게임 시작 요청
        startGame(
            selectedDifficulty
        );
    }
);

//랭킹 화면
rankingButton.addEventListener(
    "click",
    () => {
        showRanking();
    });

//다시 하기
restartButton.addEventListener(
    "click",
    () => {
        //선택된 난이도가 없는 경우
        if (!selectedDifficulty) {
            showStartScreen();
            return;
        }
        //새게임 시작
        startGame(
            selectedDifficulty
        );
    }
);

//결과 화면 -> 메인
homeButton.addEventListener(
    "click",
    () => {
        //현재 사용자 데이터 가져오기
        const userData =
            getUserData();
        updateCurrency(
            userData.currency
        );
        showStartScreen();
    }
);

//랭킹 -> 메인
rankingHomeButton.addEventListener(
    "click",
    () => {
        showStartScreen();
    }
);

//프로그램 초기화
async function initialization() {
    console.log(
        "게임 시작"
    );
    //단어 데이터 불러오기
    await loadWordData();
    //게임 설정 불러오기
    await loadGameSetting();
    //사용자 데이터 가져오기
    const userData = await loadUserData();
    //현재 재화 표시
    updateCurrency(
        userData.currency
    );
    console.log(
        "게임 초기화 완료"
    );
    showStartScreen();
}

//프로그램 실행
initialization();