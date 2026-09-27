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
export function generate_question(
    words,
    correct_word
) {
    //단어가 4개 이하인 경우
    if (!words || words.length < 4) {
        throw new Error(
            "문제 생성을 위한 단어 부족"
        );
    }
    //정답을 제외하고 오답 후보
    const wrong_words =
        words.filter(
            word =>
                word.id !== correct_word.id
        );
    //오답 선택
    const selected_wrong_words =
        shuffle(wrong_words).slice(0, 3);

    //정답 + 오답을 섞음
    const choices =
        shuffle([
            correct_word,
            ...selected_wrong_words
        ]);
    //문제 반환
    return {
        question: correct_word.meaning,
        //실제 정답
        correct_answer:
            correct_word.word,
        //선택지
        choices: choices
    };
}