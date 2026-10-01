//저장 변수
let wordData = [];
let gameSetting = {};

//단어 데이터 불러오기
export async function loadWordData() {
    try {
        const response = await fetch("../data/words.json");
        //데이터 정상적으로 불러오지 못한 경우
        if (!response.ok) {
            throw new Error("words.json을 불러오지 못함");
        }
        //데이터 정상적으로 불러온 경우
        const data = await response.json();
        wordData = data.wordData;
        console.log("단어 데이터 로드 완료:", wordData);
        return wordData;
    }
    catch (error) {
        //오류 발생시 콘솔 오류 메세지 출력 및 빈 배열 반환
        console.error("단어 데이터 로드 오류 :", error);
        alert("게임 단어 데이터를 불러오는 데 실패하였습니다.");
        return [];
    }
}

//게임 설정 불러오기 -
export async function loadGameSetting() {
    try {
        const response = await fetch("../data/settings.json");
        //데이터 정상적으로 불러오지 못한 경우
        if (!response.ok) {
            throw new Error("settings.json을 불러오지 못함");
        }
        //데이터 정상적으로 불러온 경우
        gameSetting = await response.json();
        console.log("게임 설정 로드 완료 :", gameSetting);
        return gameSetting;
    }
    catch (error) {
        //오류 발생시 콘솔 오류 메세지 출력 및 빈 객체 반환
        console.error("게임 설정 로드 오류 :", error);
        alert("게임 설정 데이터를 불러오는 데 실패했습니다.")
        return {};
    }
}

//난이도별 단어 가져오기
export function getWordsDifficulty(difficulty) {
    return wordData.filter(word => word.difficulty === difficulty);
}

//단어 전체 데이터 가져오기
export function getWordsData() {
    return wordData;
}

//게임 설정 가져오기
export function getGameSettings() {
    return gameSetting;
}