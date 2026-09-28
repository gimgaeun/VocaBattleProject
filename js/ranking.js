import {
    getRankingList
} from "./storage.js";

import {
    showRankingScreen
} from "./ui.js";

//랭킹 표시
export function showRanking() {
    //랭킹 데이터 가져오기
    const rankingList =
        getRankingList();
    const rankingElement =
        document.getElementById(
            "ranking-list"
        );
    //기존 랭킹 화면 내용 삭제
    rankingElement.innerHTML = "";
    // 랭킹이 없는 경우
    if (rankingList.length === 0) {
        const li =
            document.createElement("li");
        li.textContent =
            "아직 랭킹 기록이 없습니다.";
        rankingElement.appendChild(li);
        showRankingScreen();
        return;
    }


    // 랭킹 출력
    rankingList.forEach(
        (item, index) => {
            const li =
                document.createElement("li");
            li.textContent =
                `${index + 1}위  ${item.score}점 (${item.difficulty})`;
            rankingElement.appendChild(li);
        }
    );
    showRankingScreen();
}