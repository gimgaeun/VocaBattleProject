let userData = {
    currency: 0,
    bestScore: 0,
    rankingList: []
};

const STORAGE_KEY = "vocaBattleUserData";

//사용자 데이터 불러오기
export async function loadUserData() {
    try {
        const response = await fetch("/get-user-data");
        if (!response.ok) {
            throw new Error("userdata.json을 불러오지 못함");
        }
        const data = await response.json();
        if (Object.keys(data).length == 0 || data.currency == undefined) {
            alert("저장된 게임 기록이 없어 기본값으로 초기화되었습니다.");
            await saveUserData();
            return userData;
        }
        userData = {
            currency: Number(data.currency) || 0,
            bestScore: Number(data.bestScore) || 0,
            rankingList: Array.isArray(data.rankingList) ? data.rankingList : []
        };
        console.log("사용자 데이터 로드 완료 :", userData);
        return userData;
    } catch (error) {
        console.error("사용자 데이터 로드 오류", error);
        alert("저장된 게임 기록이 없어 기본값으로 초기화되었습니다.");
        await saveUserData();
        return userData;
    }
}

//사용자 데이터 가져오기
export function getUserData() {
    return userData;
}

//재화 추가
export function addCurrency(amount) {
    userData.currency += amount;
}

//최고 점수 업데이트
export function updateBestScore(score) {
    if (score > userData.bestScore) {
        userData.bestScore = score;
    }
}

//랭킹 추가
export function addRanking(score, difficulty) {
    userData.rankingList.push({
        score: score,
        difficulty: difficulty
    });
    //점수 높은 순으로 정렬
    userData.rankingList.sort((a, b) => b.score - a.score);
    //상위 10개만 유지
    userData.rankingList = userData.rankingList.slice(0, 10);
    console.log("랭킹 업데이트 :", userData.rankingList);
}

// 랭킹 가져오기
export function getRankingList() {
    return userData.rankingList;
}

// 사용자 데이터 저장
export async function saveUserData() {
    console.log("저장 시작");
    try {
        const response = await fetch("/save-user-data", {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            throw new Error("사용자 데이터 저장 실패");
        }
        const result = await response.json();
        console.log("저장 결과:", result);
    } catch (error) {
        console.error("저장 오류:", error);
        alert("기록 저장 실패했습니다.")
    }
}