//랜덤
function shuffle(array) {
    //배열 복사
    const shuffled = [...array];
    //위치 랜덤
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j =
            Math.floor(
                Math.random() * (i + 1)
            );
        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

//문제 제작
export function generateQuestion(
    words,
    correctWord
) {
    //단어가 4개 이하인 경우
    if (!words || words.length < 4) {
        throw new Error(
            "문제 생성을 위한 단어 부족"
        );
    }
    //정답을 제외하고 오답 후보
    const wrongWords =
        words.filter(
            word =>
                word.id !== correctWord.id
        );
    //오답 선택
    const selectedWrongWords =
        shuffle(wrongWords).slice(0, 3);

    //정답 + 오답을 섞음
    const choices =
        shuffle([
            correctWord,
            ...selectedWrongWords
        ]);
    //문제 반환
    return {
        question: correctWord.meaning,
        //실제 정답
        correctAnswer:
            correctWord.word,
        //선택지
        choices: choices
    };
}