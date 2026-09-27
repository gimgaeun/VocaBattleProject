let user_data = {
    currency: 0,
    best_score: 0,
    ranking_list: []
};


//사용자 데이터 불러오기
export async function load_user_data() {
    try {
        const response = await fetch(
            "/data/userdata.json"
        );
        //데이터를 불러오지 못한 경우
        if (!response.ok) {
            throw new Error(
                "userdata.json을 불러오지 못함"
            );
        }
        //데이터 불러온 경우
        const data = await response.json();
        user_data = {
            currency: Number(data.currency) || 0,
            best_score:
                Number(data.best_score) || 0,
            ranking_list:
                Array.isArray(data.ranking_list)
                    ? data.ranking_list
                    : []
        };
        console.log(
            "사용자 데이터 로드 완료 :",
            user_data
        );
        return user_data;
        //오류가 발생한 경우
    } catch (error) {
        console.error(
            "사용자 데이터 로드 오류",
            error
        );
        return user_data;
    }
}


//사용자 데이터 가져오기
export function get_user_data() {
    return user_data;
}

//재화 추가
export function add_currency(amount) {
    user_data.currency += amount;
}

// 최고 점수 업데이트
export function update_best_score(score) {
    if (score > user_data.best_score) {
        user_data.best_score = score;
    }
}

// 랭킹 추가
export function add_ranking(score, difficulty) {
    user_data.ranking_list.push({
        score: score,
        difficulty: difficulty
    });
    //점수 높은 순으로 정렬
    user_data.ranking_list.sort(
        (a, b) => b.score - a.score
    );
    //상위 10개만 유지
    user_data.ranking_list =
        user_data.ranking_list.slice(0, 10);
    console.log(
        "랭킹 업데이트 :",
        user_data.ranking_list
    );
}

// 랭킹 가져오기
export function get_ranking_list() {
    return user_data.ranking_list;
}

// 사용자 데이터 저장
export async function save_user_data() {
    console.log("저장 시작");
    try {
        const response = await fetch(
            "/save-user-data",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body:
                    JSON.stringify(user_data)
            }
        );
        console.log(
            "fetch 완료"
        );
        console.log(
            "status:",
            response.status
        );
        //저장 실패한 경우
        if (!response.ok) {
            throw new Error(
                "사용자 데이터 저장 실패"
            );
        }
        //저장 성공한 경우
        const result =
            await response.json();
        console.log(
            "저장 결과:",
            result
        );
        //오류가 발생한 경우
    } catch (error) {
        console.error(
            "저장 오류:",
            error
        );
    }
}