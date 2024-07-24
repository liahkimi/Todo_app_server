import express from "express";

// express 함수 사용 선언
const app = express();
const port = 8000;
// 서버 실행
app.listen(port, () => {
    console.log(`server started: ${port} port!`)
})
// get요청 -메인페이지
app.get('/', (_, res) => {
    // 페이지 들어오면 res 응답할 내용의 형식
    res.set({"Content-Type" : "text/html; charset=utf-8;"})
    // 서버 종료하면 띄울 화면
    res.end('<h1>Welcome Express!</h1>')
})