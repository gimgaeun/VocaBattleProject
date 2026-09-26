function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function generate_question(words) {
    if (!words || words.length < 4) {
        throw new Error("문제 생성을 위한 단어 부족");
    }
    const correct_index =
        Math.floor(Math.random() * words.length);
    const correct_word = words[correct_index];
    const wrong_words = words.filter(
        word => word.id !== correct_word.id
    );
    const selected_wrong_words =
        shuffle(wrong_words).slice(0, 3);
    const choices = shuffle([
        correct_word, ...selected_wrong_words
    ]);
    return {
        question: correct_word.meaning,
        correct_answer: correct_word.word,
        choices: choices
    };
}