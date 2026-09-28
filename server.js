const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8"
};

function handleApiRequest(req, res) {
    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });
    req.on("end", () => {
        try {
            const userData = JSON.parse(body);
            const filePath = path.join(ROOT_DIR, "data", "userdata.json");
            fs.writeFileSync(filePath, JSON.stringify(userData, null, 4), "utf-8");
            console.log("userdata.json 저장 완료");
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
    if (!resolvedPath.startsWith(ROOT_DIR)) {
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
        handleApiRequest(req, res);
    } else {
        serveStaticFile(req, res);
    }
});


server.listen(PORT, () => {
    console.log(`Voca Battle 서버 실행: http://localhost:${PORT}`);
});