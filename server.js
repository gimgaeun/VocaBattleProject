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

const server = http.createServer((req, res) => {

    // =========================
    // 사용자 데이터 저장
    // =========================
    if (
        req.method === "POST" &&
        req.url === "/save-user-data"
    ) {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const userData = JSON.parse(body);

                const filePath = path.join(
                    ROOT_DIR,
                    "data",
                    "userdata.json"
                );

                fs.writeFileSync(
                    filePath,
                    JSON.stringify(
                        userData,
                        null,
                        4
                    ),
                    "utf-8"
                );

                console.log("userdata.json 저장 완료");

                res.writeHead(200, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    success: true
                }));

            } catch (error) {

                console.error(
                    "사용자 데이터 저장 오류:",
                    error
                );

                res.writeHead(500, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    success: false
                }));
            }
        });

        return;
    }

    // =========================
    // 정적 파일 제공
    // =========================

    let filePath = req.url === "/"
        ? path.join(ROOT_DIR, "index.html")
        : path.join(ROOT_DIR, decodeURIComponent(req.url));

    // 쿼리 문자열 제거
    filePath = filePath.split("?")[0];

    // 경로 보안
    if (!filePath.startsWith(ROOT_DIR)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (error, data) => {

        if (error) {
            res.writeHead(404, {
                "Content-Type":
                    "text/plain; charset=utf-8"
            });

            res.end("Not Found");
            return;
        }

        const extension =
            path.extname(filePath).toLowerCase();

        const contentType =
            MIME_TYPES[extension] ||
            "application/octet-stream";

        res.writeHead(200, {
            "Content-Type": contentType
        });

        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(
        `Voca Battle 서버 실행: http://localhost:${PORT}`
    );
});