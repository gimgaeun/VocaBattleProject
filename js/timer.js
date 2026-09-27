import {
    get_game_settings
} from "./data.js";

import {
    update_score,
    set_timer_warning,
    set_answer_position,
    update_timer
} from "./ui.js";

//타이머 아이디
let timer_id = null;

//버튼 낙하 애니메이션 아이디
let animation_id = null;

//현재 남은 시간
let remaining_time = 0;

//답변 버튼 현재 위치
let falling_position = 0;

//이전 애니메이션 시간
let last_timestamp = null;

//타이머 시작
export function start_timer(on_time_over, time_limit = null) {
    //기존 타이머 정지
    stop_timer();
    //게임 설정 가져오기
    const settings = get_game_settings();
    //문제 제한 시간 설정
    remaining_time =
        time_limit ?? settings.initial_time ?? 10;
    //초기화
    falling_position = 0;
    last_timestamp = null;
    update_timer(remaining_time);
    set_timer_warning(false);
    //카운트다운 시작
    timer_id = setInterval(() => {
        remaining_time--;
        if (remaining_time < 0) {
            remaining_time = 0;
        }
        update_timer(remaining_time);
        //3초이하인지 확인
        set_timer_warning(remaining_time <= 3);
        //시간이 끝났는지 확인
        if (remaining_time <= 0) {
            stop_timer();
            if (on_time_over) {
                on_time_over();
            }
        }
    }, 1000);
    start_falling(remaining_time);
}

//타이머 정지
export function stop_timer() {
    if (timer_id !== null) {
        clearInterval(timer_id);
        timer_id = null;
    }
    stop_falling();
}

//버튼 낙하
export function start_falling(time_limit) {
    stop_falling();
    //초기화
    falling_position = 0;
    last_timestamp = null;
    const falling_area = document.getElementById("falling-area");
    const area_height = falling_area.clientHeight;
    const button_height = 82;
    // 버튼이 바닥에 도착할 수 있는 최대 위치
    const max_position =
        area_height - button_height;
    //애니메이션
    function animate(timestamp) {
        if (last_timestamp === null) {
            last_timestamp = timestamp;
        }
        const elapsed =
            timestamp - last_timestamp;
        //제한시간에 맞춰 진행률 계산
        falling_position +=
            (elapsed / (time_limit * 1000))
            * max_position;
        //바닥을 넘어가지 않도록 제한
        if (falling_position > max_position) {
            falling_position = max_position;
        }
        set_answer_position(falling_position);
        last_timestamp = timestamp;
        animation_id =
            requestAnimationFrame(animate);
    }
    animation_id =
        requestAnimationFrame(animate);
}

//낙하 정지
export function stop_falling() {
    if (animation_id != null) {
        cancelAnimationFrame(animation_id);
        animation_id = null;
    }
    last_timestamp = null;
}

//남은 시간 가져오기
export function get_remaing_time() {
    return remaining_time;
}