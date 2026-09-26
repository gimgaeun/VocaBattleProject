//데이터 변수
let word_data = [];
let game_setting = {};

//단어 데이터 불러오기
export async function load_word_data() {
    try {
        const response = await fetch("../data/words.json");
        if (!response.ok) {
            throw new Error("words.json을 불러오지 못함");
        }
        const data = await response.json();
        word_data = data.word_data;
        return word_data;
    }
    catch (error) {
        console.error("단어 데이터 로드 오류 :", error);
        return [];
    }
}

//게임 설정 불러오기
export async function load_game_setting() {
    try {
        const response = await fetch("../data/setting.json");
        if (!response.ok) {
            throw new Error("setting.json을 불러오지 못함");
        }
        game_setting = await response.json();
        console.log("게임 설정 로드 완료 :", game_setting);
        return game_setting;
    }
    catch (error) {
        console.error("게임 설정 로드 오류 :", error);
        return {};
    }
}

//난이도별 단어 가져오기
export function get_words_difficulty(difficulty) {
    return word_data.filter(
        word => word.difficulty === difficulty
    );
}

//단어 전체 데이터 가져오기
export function get_words_data() {
    return word_data;
}

//게임 설정 가져오기
export function get_game_settings() {
    return game_setting;
}