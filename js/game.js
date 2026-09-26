import {
    get_words_difficulty
} from "./data.js";

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
    disable_answer_buttons,
    get_answer_buttons
} from "./ui.js";

import {
    start_timer,
    stop_timer
} from "./timer.js";
//게임 상태
let game_running = false;
let selected_difficulty = null;
let current_words = [];
let current_question = null;
let score = 0;

//게임 시작
export function start_game(difficulty) {
    selected_difficulty = difficulty;
    current_words =
        get_words_difficulty(
            selected_difficulty
        );
    if (current_words.length < 4) {
        alert("문제 생성을 위한 단어 부족");
        return false;
    }
    score = 0;
    update_score(score);
    game_running = true;
    show_game_screen();
    create_next_question();
    console.log("게임 시작 :", selected_difficulty);
    return true;
}

//다음 문제 생성
export function create_next_question() {
    if (!game_running) {
        return;
    }
    current_question = generate_question(current_words);
    render_question(
        current_question
    );
    start_timer(() => {
        game_over("시간이 종료됨");
    });
}

//정답 처리
export function handle_answer(button) {
    if (!game_running) {
        return;
    }
    if (button.disabled) {
        return;
    }
    //사용자가 선택한 답
    const selected_answer =
        button.dataset.answer;
    //정답
    if (selected_answer === current_question.correct_answer) {
        console.log("정답");
        show_correct_answer(button);
        score++;
        update_score(score);
        disable_answer_buttons();
        setTimeout(() => {
            if (!game_running) {
                return;
            }
            create_next_question();
        }, 300);
    }
    //오답
    else {
        console.log("오답");
        show_wrong_answer(button);
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
export function game_over(reason = "게임 종료") {
    if (!game_running) {
        return;
    }
    game_running = false;
    stop_timer();
    disable_answer_buttons();
    console.log("게임 종료", reason);
    console.log("최종 점수 :", score);
    show_final_score(score);
    setTimeout(() => {
        show_result_screen();
    }, 300);
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
//정답 버튼 연결
const answer_buttons = get_answer_buttons();
answer_buttons.forEach(button => {
    button.addEventListener("click", () => {
        handle_answer(button);
    });
});