import {
    get_words_difficulty,
    get_game_settings
} from "./data.js";

import {
    add_currency,
    update_best_score,
    add_ranking,
    get_user_data,
    save_user_data
} from "./storage.js";

import {
    generate_question
} from "./question.js";

import {
    show_game_screen,
    show_result_screen,
    render_question,
    update_score,
    show_final_score,
    show_correct_answer,
    show_wrong_answer,
    show_earned_currency,
    disable_answer_buttons,
    get_answer_buttons
} from "./ui.js";

import {
    start_timer,
    stop_timer
} from "./timer.js";

//게임 진행 여부
let game_running = false;

//선택 난이도 저장
let selected_difficulty = null;

//선택된 난이도 단어 저장
let current_words = [];

//이미 출제된 단어 id 저장
let used_words = [];

//현재 출제 문제 저장
let current_question = null;

//현재 점수
let score = 0;

//현재 연속 정답 횟수
let combo = 0;

//게임 시작
export function start_game(difficulty) {
    //선택된 난이도 저장
    selected_difficulty = difficulty;
    //난이도 단어 가져오기
    current_words =
        get_words_difficulty(
            selected_difficulty
        );
    //난이도 단어가 4개 이하인 경우
    if (current_words.length < 4) {
        alert("문제 생성을 위한 단어 부족");
        return false;
    }
    //초기화
    score = 0;
    combo = 0;
    used_words = [];
    update_score(score);
    //게임 상태 변경
    game_running = true;
    //게임 화면 표시
    show_game_screen();
    //첫문제 생성
    create_next_question();
    console.log(
        "게임 시작 :",
        selected_difficulty
    );
    //게임 시작 성공
    return true;
}

//다음 문제 생성
export function create_next_question() {
    // 게임이 진행 중이 아니라면
    // 새로운 문제를 만들지 않는다.
    if (!game_running) {
        return;
    }
    //출제되지 않은 단어 확인
    const unused_words =
        current_words.filter(
            word =>
                !used_words.includes(word.id)
        );
    //모든 단어 사용한 경우
    if (unused_words.length === 0) {
        game_over(
            "모든 단어 출제 완료"
        );
        return;
    }
    //정답 단어 랜덤 선택
    const random_index =
        Math.floor(
            Math.random() * unused_words.length
        );
    const correct_word =
        unused_words[random_index];
    //출제기록 저장
    used_words.push(
        correct_word.id
    );
    //문제생성
    current_question =
        generate_question(
            current_words,
            correct_word
        );
    //문제 화면 출력
    render_question(
        current_question
    );
    //설정 가져오기
    const settings =
        get_game_settings();
    console.log(
        "settings 확인:",
        settings
    );
    //제한 시간 계산
    const decrease_count =
        Math.max(
            0,
            combo - settings.decrease_start_count
        );
    const time_limit =
        Math.max(
            settings.minimum_time,
            settings.initial_time -
            (
                decrease_count *
                settings.decrease_amount
            )
        );
    console.log(
        "현재 콤보 :",
        combo
    );
    console.log(
        "이번 문제 제한시간 :",
        time_limit
    );
    //타이머 시작
    start_timer(
        () => {
            game_over(
                "시간이 종료됨"
            );
        },
        time_limit
    );
}

//정답 처리
export function handle_answer(button) {
    //게임이 끝난 경우
    if (!game_running) {
        return;
    }
    //비활성화 버튼 확인
    if (button.disabled) {
        return;
    }
    //사용자가 선택한 답
    const selected_answer =
        button.dataset.answer;
    //정답인지 확인
    if (selected_answer === current_question.correct_answer) {
        console.log("정답");
        //버튼 정답 스타일로 번경
        show_correct_answer(button);
        //점수 +1
        score++;
        //연속 정답 +1
        combo++;
        //화면 점수 업데이트
        update_score(score);
        console.log("점수 :", score);
        console.log("연속 정답 :", combo);
        //정답 버튼 비활성화
        disable_answer_buttons();
        //0.3초 후 다음문제 출제
        setTimeout(() => {
            if (!game_running) {
                return;
            }
            create_next_question();
        }, 300);
    }
    //오답 처리
    else {
        console.log("오답");
        //버튼 오답 스타일 변경
        show_wrong_answer(button);
        //정답도 표시함
        answer_buttons.forEach(answer_button => {
            if (
                answer_button.dataset.answer ===
                current_question.correct_answer
            ) {
                show_correct_answer(answer_button);
            }
        });
        //게임 종료
        setTimeout(() => {
            game_over(
                "오답 선택"
            );
        }, 500);
    }
}

//게임 종료
export async function game_over(reason = "게임 종료") {
    //게임이 끝난 경우
    if (!game_running) {
        return;
    }
    //게임 상태 변경
    game_running = false;
    //타이머 정지
    stop_timer();
    //정답 버튼 비활성화
    disable_answer_buttons();
    console.log("게임 종료 :", reason);
    console.log("최종 점수 :", score);
    //const settings = get_game_settings();
    //재화 비율
    let difficulty_multiplier = 1;
    if (selected_difficulty === "초급") {
        difficulty_multiplier = 1;
    } else if (selected_difficulty === "중급") {
        difficulty_multiplier = 2;
    } else if (selected_difficulty === "고급") {
        difficulty_multiplier = 3;
    }
    //재화 계산
    const earned_currency =
        score * difficulty_multiplier;
    //재화 추가
    add_currency(earned_currency);
    //최고 점수 갱신
    update_best_score(score);
    //랭킹 추가
    add_ranking(score, selected_difficulty);
    //const user_data = get_user_data();
    //결과 화면 점수 표시
    show_final_score(score);
    //결과 화면 획득 재화 표시
    show_earned_currency(earned_currency);
    //결과 화면
    show_result_screen();
    //사용자 데이터 저장
    save_user_data();
}

//현재 점수 가져오기
export function get_score() {
    return score;
}

//게임 상태 확인
export function is_game_running() {
    return game_running;
}

//현재 문제 가져오기
export function get_current_question() {
    return current_question;
}

//현재 난이도 가져오기
export function get_selected_difficulty() {
    return selected_difficulty;
}
//버튼 연결
const answer_buttons = get_answer_buttons();
answer_buttons.forEach(button => {
    button.addEventListener("click", () => {
        handle_answer(button);
    });
});