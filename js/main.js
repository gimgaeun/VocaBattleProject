import {
    load_word_data,
    load_game_setting
} from "./data.js";

import {
    start_game
} from "./game.js";

import {
    show_start_screen,
    show_ranking_screen
} from "./ui.js";
//선택된 난이도
let selected_difficulty = null;

//버튼 요소
const difficulty_button =
    document.querySelectorAll(
        ".difficulty-btn"
    );

const start_button =
    document.getElementById(
        "start-btn"
    );

const ranking_button =
    document.getElementById(
        "ranking-btn"
    );

const restart_button =
    document.getElementById(
        "restart-btn"
    );

const home_button =
    document.getElementById(
        "home-btn"
    );

const ranking_home_button =
    document.getElementById(
        "ranking-home-btn"
    );

//난이도 선택
difficulty_button.forEach(button => {
    button.addEventListener(
        "click",
        () => {
            //선택한 난이도 저장
            selected_difficulty =
                button.dataset.difficulty;

            //기존 선택지 삭제
            difficulty_button.forEach(
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
                selected_difficulty
            );
        }
    );
});

//게임 시작
start_button.addEventListener(
    "click",
    () => {
        //난이도 선택 확인
        if (!selected_difficulty) {
            alert(
                "난이도를 선택해주세요."
            );
            return;
        }
        //game.js 게임 시작 요청
        start_game(
            selected_difficulty
        );
    }
);

//랭킹 화면
ranking_button.addEventListener(
    "click",
    () => {
        show_ranking_screen();
    }
);

//다시 하기
restart_button.addEventListener(
    "click",
    () => {
        if (!selected_difficulty) {
            show_start_screen();
            return;
        }
        //새게임 시작
        start_game(
            selected_difficulty
        );
    }
);

//결과 화면 -> 메인
home_button.addEventListener(
    "click",
    () => {
        show_start_screen();
    }
);

//랭킹 -> 메인
ranking_home_button.addEventListener(
    "click",
    () => {
        show_start_screen();
    }
);

//프로그램 초기화
async function initialization() {
    console.log(
        "Voca Battle 시작"
    );
    //단어 데이터 로드
    await load_word_data();
    //게임 설정 로드
    await load_game_setting();
    console.log(
        "게임 초기화 완료"
    );
    //시작 화면 표시
    show_start_screen();
}

//프로그램 실행
initialization();