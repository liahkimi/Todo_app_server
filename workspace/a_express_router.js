import express, { query } from "express";
import { parse } from 'url';

const app = express()
const port = 8000;

app.listen(port, () => {
    console.log(`server is on ${port} port!`);
})

const mainPage = (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end('<h1>환영합니다. 😎</h1>')
}

const newProduct = (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    const query = parse(req.url, true).query; //쿼리스트링
    res.end(`
        <h1 style='text-align:center;'>신상품 소개</h1>
        <ul style='text-align:center; list-style:none;'>
            <li>${query.new1}</li>
            <li>${query.new2}</li>
        </ul>
    `)
}

// hot1, hot2, notFount
// 10분!
const hotProduct = (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    const query = parse(req.url, true).query; // 쿼리스트링
    res.end(`
        <h1 style='text-align:center;'>신상품 소개</h1>
        <ul style='text-align:center; list-style:none;'>
            <li>${query.hot1}</li>
            <li>${query.hot2}</li>
        </ul>
    `)
}
const notFound = (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.statusCode = 404;
    res.end("<h1 style='text-align:center;'>페이지를 찾을 수 없습니다.</h1>")
}

app.get("/", mainPage)
app.get("/new", newProduct)
app.get("/hot", hotProduct)
app.get("*", notFound)

// new 신상품
// hot 핫상품
// notFound


