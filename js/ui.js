const start_screen =
    document.getElementById("start-screen");
const game_screen =
    document.getElementById("game-screen");
const result_screen =
    document.getElementById("result-screen");
const ranking_screen =
    document.getElementById("ranking-screen");
const question_word =
    document.getElementById("question-word");
const score_element =
    document.getElementById("score");
const timer_element =
    document.getElementById("timer");
const falling_area =
    document.getElementById("falling_area");
const answer_buttons =
    document.querySelectorAll(".answer-btn");

export function show_screen(screen) {
    start_screen.classList.add("hidden");
    game_screen.classList.add("hidden");
    result_screen.classList.add("hidden");
    ranking_screen.classList.add("hidden");
    screen.classList.remove("hidden");
}

export function show_start_screen() {
    show_screen(start_screen);
}

export function show_game_screen() {
    show_screen(game_screen);
}

export function show_result_screen() {
    show_screen(result_screen);
}

export function show_ranking_screen() {
    show_screen(ranking_screen);
}

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
        }
    );
}

export function update_score(score) {
    score_element.textContent = score;
}

export function update_timer(time) {
    timer_element.textContent =
        Number(time).toFixed(1);
}

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

export function get_answer_buttons() {
    return answer_buttons;
}

export function get_falling_area() {
    return falling_area;
}

export function set_answer_position(position) {
    answer_buttons.forEach(button => {
        button.style.top =
            `${position}px`;
    });
}

export function disable_answer_buttons() {
    answer_buttons.forEach(button => {
        button.disabled = true;
    });
}

export function enable_answer_buttons() {
    answer_buttons.forEach(button => {
        button.disabled = false;
    });
}

export function show_correct_answer(button) {
    button.classList.add("correct");
}

export function show_wrong_answer(button) {
    button.classList.add("wrong");
}

export function show_final_score(score) {
    const final_score =
        document.getElementById("final-score");
    if (final_score) {
        final_score.textContent = score;
    }
}

export function show_earned_currency(currency) {
    const earned_currency =
        document.getElementById("earned-currency")
    if (earned_currency) {
        earned_currency.textContent = currency;
    }
}