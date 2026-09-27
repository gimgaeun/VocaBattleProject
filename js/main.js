import {
    load_word_data,
    load_game_setting
} from "./data.js";

import {
    load_user_data,
    get_user_data
} from "./storage.js";

import {
    start_game
} from "./game.js";

import {
    show_start_screen,
    update_currency
} from "./ui.js";

import {
    show_ranking
} from "./ranking.js";

//선택된 난이도
let selected_difficulty = null;

//버튼 목록
const difficulty_button =
    document.querySelectorAll(
        ".difficulty-btn"
    );

//게임 시작 버튼
const start_button =
    document.getElementById(
        "start-btn"
    );

//랭킹 보기 버튼
const ranking_button =
    document.getElementById(
        "ranking-btn"
    );

//다시 하기 버튼
const restart_button =
    document.getElementById(
        "restart-btn"
    );

//결과->메인으로 버튼
const home_button =
    document.getElementById(
        "home-btn"
    );

//랭킹->메인으로 버튼
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
        //게임 시작 요청
        start_game(
            selected_difficulty
        );
    }
);

//랭킹 화면
ranking_button.addEventListener(
    "click",
    () => {
        show_ranking();
    });

//다시 하기
restart_button.addEventListener(
    "click",
    () => {
        //선택된 난이도가 없는 경우
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
        //현재 사용자 데이터 가져오기
        const user_data =
            get_user_data();
        update_currency(
            user_data.currency
        );
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
        "게임 시작"
    );
    //단어 데이터 불러오기
    await load_word_data();
    //게임 설정 불러오기
    await load_game_setting();
    //사용자 데이터 가져오기
    const user_data = await load_user_data();
    //현재 재화 표시
    update_currency(
        user_data.currency
    );
    console.log(
        "게임 초기화 완료"
    );
    show_start_screen();
}

//프로그램 실행
initialization();