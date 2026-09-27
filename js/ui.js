//시작 화면
const start_screen =
    document.getElementById("start-screen");

//게임 화면
const game_screen =
    document.getElementById("game-screen");

//결과 화면
const result_screen =
    document.getElementById("result-screen");

//랭킹 화면
const ranking_screen =
    document.getElementById("ranking-screen");

//현재 문제 단어
const question_word =
    document.getElementById("question-word");

//현재 점수
const score_element =
    document.getElementById("score");

//현재 남은 시간
const timer_element =
    document.getElementById("timer");

//떨어지는 버튼 영역
const falling_area =
    document.getElementById("falling-area");

//정답 선택 버튼
const answer_buttons =
    document.querySelectorAll(".answer-btn");

//화면 전환
export function show_screen(screen) {
    //화면 숨김
    start_screen.classList.add("hidden");
    game_screen.classList.add("hidden");
    result_screen.classList.add("hidden");
    ranking_screen.classList.add("hidden");
    //마지막 screen은 숨김 제거
    screen.classList.remove("hidden");
}

//시작 화면 보여주기
export function show_start_screen() {
    show_screen(start_screen);
}

//게임 화면 보여주기
export function show_game_screen() {
    show_screen(game_screen);
}

//결과 화면 보여주기
export function show_result_screen() {
    show_screen(result_screen);
}

//랭킹 화면 보여주기
export function show_ranking_screen() {
    show_screen(ranking_screen);
}

//문제, 선택지 표시
export function render_question(question) {
    question_word.textContent =
        question.question;
    question.choices.forEach(
        (choice, index) => {
            const button =
                answer_buttons[index];
            button.textContent =
                choice.word;
            button.dataset.answer =
                choice.word;
            button.classList.remove(
                "correct",
                "wrong"
            );
            button.disabled = false;
            button.style.top = "0px";
            //단어 길이에 따른 글자 크기 조절
            const word_length =
                choice.word.length;
            if (word_length <= 8) {
                button.style.fontSize = "24px";
            } else if (word_length <= 10) {
                button.style.fontSize = "20px";
            } else if (word_length <= 12) {
                button.style.fontSize = "15px";
            } else {
                button.style.fontSize = "14px";
            }
        }
    );
}

//점수 보여주기
export function update_score(score) {
    score_element.textContent = score;
}

//남은 시간 보여주기
export function update_timer(time) {
    timer_element.textContent =
        Number(time).toFixed(1);
}

//시간 부족 경고 보여주기
export function set_timer_warning(isWarning) {
    if (isWarning) {
        timer_element.classList.add(
            "warning"
        );
    } else {
        timer_element.classList.remove(
            "warning"
        );
    }
}

//정답 버튼
export function get_answer_buttons() {
    return answer_buttons;
}

//떨어지는 영역
export function get_falling_area() {
    return falling_area;
}

//정답 버튼 위치 변경
export function set_answer_position(position) {
    answer_buttons.forEach(button => {
        button.style.top =
            `${position}px`;
    });
}

//정답 버튼 비활성화
export function disable_answer_buttons() {
    answer_buttons.forEach(button => {
        button.disabled = true;
    });
}

//정답 버튼 활성화
export function enable_answer_buttons() {
    answer_buttons.forEach(button => {
        button.disabled = false;
    });
}

//정답 버튼 -> 정답 상태
export function show_correct_answer(button) {
    button.classList.add("correct");
}

//오답 버튼 -> 오답 상태
export function show_wrong_answer(button) {
    button.classList.add("wrong");
}

//최종 점수 표시
export function show_final_score(score) {
    const final_score =
        document.getElementById("final-score");
    if (final_score) {
        final_score.textContent = score;
    }
}

//획득 재화 표시
export function show_earned_currency(amount) {
    const earned_currency =
        document.getElementById("earned-currency")
    if (earned_currency) {
        earned_currency.textContent = amount;
    }
}

// 보유 재화 표시
export function update_currency(currency) {
    const currency_element =
        document.getElementById("currency");
    if (currency_element) {
        currency_element.textContent = currency;
    }
}