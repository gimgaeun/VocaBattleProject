//단어 데이터 저장 변수
let word_data = [];

//게임 설정 데이터 저장 변수
let game_setting = {};

//단어 데이터 불러오기
export async function load_word_data() {
    try {
        const response = await fetch("../data/words.json");
        //데이터 정상적으로 불러오지 못한 경우
        if (!response.ok) {
            throw new Error("words.json을 불러오지 못함");
        }
        //데이터 정상적으로 불러온 경우
        const data = await response.json();
        word_data = data.word_data;
        console.log("단어 데이터 로드 완료:", word_data);
        return word_data;
    }
    catch (error) {
        //오류 발생시 콘솔 오류 메세지 출력 및 빈 배열 반환
        console.error("단어 데이터 로드 오류 :", error);
        return [];
    }
}

//게임 설정 불러오기
export async function load_game_setting() {
    try {
        const response = await fetch("../data/settings.json");
        //데이터 정상적으로 불러오지 못한 경우
        if (!response.ok) {
            throw new Error("settings.json을 불러오지 못함");
        }
        //데이터 정상적으로 불러온 경우
        game_setting = await response.json();
        console.log("게임 설정 로드 완료 :", game_setting);
        return game_setting;
    }
    catch (error) {
        //오류 발생시 콘솔 오류 메세지 출력 및 빈 객체 반환
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