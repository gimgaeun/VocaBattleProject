import {
    get_game_settings
} from "./data.js";

import {
    update_score,
    set_timer_warning,
    set_answer_position,
    update_timer
} from "./ui.js";

let timer_id = null;
let animation_id = null;
let remaining_time = 0;
let falling_position = 0;
let last_timestamp = null;

export function start_timer(on_time_over) {
    stop_timer();
    const settings = get_game_settings();
    remaining_time =
        settings.initial_time ?? 10;
    falling_position = 0;
    last_timestamp = null;
    update_timer(remaining_time);
    set_timer_warning(false);
    timer_id = setInterval(() => {
        remaining_time--;
        if (remaining_time < 0) {
            remaining_time = 0;
        }
        update_timer(remaining_time);
        set_timer_warning(remaining_time <= 3);
        if (remaining_time <= 0) {
            stop_timer();
            if (on_time_over) {
                on_time_over();
            }
        }
    }, 1000);
    start_falling();
}

export function stop_timer() {
    if (timer_id !== null) {
        clearInterval(timer_id);
        timer_id = null;
    }
    stop_falling();
}

export function start_falling() {
    stop_falling();
    falling_position = 0;
    last_timestamp = null;
    function animate(timestamp) {
        if (last_timestamp === null) {
            last_timestamp = timestamp;
        }
        const elapsed = timestamp - last_timestamp;
        falling_position += elapsed * 0.05;
        set_answer_position(falling_position);
        last_timestamp = timestamp;
        animation_id = requestAnimationFrame(animate);
    }
    animation_id = requestAnimationFrame(animate);
}

export function stop_falling() {
    if (animation_id != null) {
        cancelAnimationFrame(animation_id);
        animation_id = null;
    }
    last_timestamp = null;
}
export function get_remaing_time() {
    return remaining_time;
}