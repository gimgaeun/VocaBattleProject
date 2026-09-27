import {
    get_ranking_list
} from "./storage.js";

import {
    show_ranking_screen
} from "./ui.js";

//랭킹 표시
export function show_ranking() {
    //랭킹 데이터 가져오기
    const ranking_list =
        get_ranking_list();
    const ranking_element =
        document.getElementById(
            "ranking-list"
        );
    //기존 랭킹 화면 내용 삭제
    ranking_element.innerHTML = "";
    // 랭킹이 없는 경우
    if (ranking_list.length === 0) {
        const li =
            document.createElement("li");
        li.textContent =
            "아직 랭킹 기록이 없습니다.";
        ranking_element.appendChild(li);
        show_ranking_screen();
        return;
    }


    // 랭킹 출력
    ranking_list.forEach(
        (item, index) => {
            const li =
                document.createElement("li");
            li.textContent =
                `${index + 1}위  ${item.score}점 (${item.difficulty})`;
            ranking_element.appendChild(li);
        }
    );
    show_ranking_screen();
}