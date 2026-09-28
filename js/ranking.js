import {
    getRankingList
} from "./storage.js";

import {
    showRankingScreen
} from "./ui.js";

//랭킹 표시
export function showRanking() {
    const rankingList = getRankingList();
    const rankingElement = document.getElementById("ranking-list");
    if (!rankingElement) {
        console.error("랭킹을 표시할 요소를 찾을 수 없습니다.");
        return;
    }
    //기존 랭킹 화면 내용 초기화
    rankingElement.innerHTML = "";
    // 랭킹이 없는 경우
    if (rankingList.length === 0) {
        const li = document.createElement("li");
        li.textContent = "아직 랭킹 기록이 없습니다.";
        rankingElement.appendChild(li);
    } else {
        rankingList.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = `${item.score}점 (${item.difficulty})`;
            rankingElement.appendChild(li);
        });
    }
    showRankingScreen();
    return;
}