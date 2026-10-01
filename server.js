require("dotenv").config();

const http = require("http");
const fs = require("fs");
const path = require("path");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_FILE_PATH = process.env.GITHUB_FILE_PATH || "data/userdata.json";
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname);

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8"
};

async function getGithubUserData() {
    const url =
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}?ref=${GITHUB_BRANCH}`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `GitHub 데이터 읽기 실패: ${response.status} ${errorText}`
        );
    }

    const result = await response.json();
    const content = Buffer.from(result.content, "base64").toString("utf-8");

    return {
        data: JSON.parse(content),
        sha: result.sha
    };
}

async function saveGithubUserData(userData, sha) {

    const url =
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;

    const content = Buffer.from(JSON.stringify(userData, null, 4)).toString("base64");
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28"
        },
        body: JSON.stringify({
            message: "Update userdata.json",
            content: content,
            sha: sha,
            branch: GITHUB_BRANCH
        })
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub 데이터 저장 실패: ${response.status} ${errorText}`);
    }
    return await response.json();
}

async function handleGetUserData(req, res) {
    try {
        const githubData = await getGithubUserData();

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(githubData.data));
    } catch (error) {
        console.error("GitHub 사용자 데이터 로드 오류:", error);
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ success: false }));
    }
}

async function handleSaveUserData(req, res) {
    let body = "";
    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", async () => {
        try {
            const userData = JSON.parse(body);
            // 현재 GitHub 파일 가져오기
            const githubData = await getGithubUserData();
            // GitHub 파일 수정
            await saveGithubUserData(userData, githubData.sha);
            console.log("GitHub userdata.json 저장 완료");

            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ success: true }));

        } catch (error) {
            console.error("사용자 데이터 저장 오류:", error);
            res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ success: false }));
        }
    });
}

function serveStaticFile(req, res) {
    // 쿼리 문자열 제거
    const parsedUrl = req.url.split("?")[0];
    let filePath = parsedUrl === "/"
        ? path.join(ROOT_DIR, "index.html")
        : path.join(ROOT_DIR, decodeURIComponent(parsedUrl));

    // 경로 보안 강화 (Directory Traversal 방어)
    const resolvedPath = path.resolve(filePath);
    if (resolvedPath !== ROOT_DIR && !resolvedPath.startsWith(ROOT_DIR + path.sep)) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Forbidden");
        return;
    }

    fs.readFile(resolvedPath, (error, data) => {
        if (error) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Not Found");
            return;
        }

        const extension = path.extname(resolvedPath).toLowerCase();
        const contentType = MIME_TYPES[extension] || "application/octet-stream";

        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/save-user-data") {
        handleSaveUserData(req, res);
    } else if (req.method === "GET" && req.url === "/get-user-data") {
        handleGetUserData(req, res);
    } else {
        serveStaticFile(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`Voca Battle 서버 실행: http://localhost:${PORT}`);
});



