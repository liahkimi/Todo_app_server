import express from 'express';
import connect from './connect/connect.js';
import cors from 'cors';
import rootRouter from './routes/rootRouter.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import { initializePassport } from './auth/auth.js';

// mongoDB 연결
connect()

const port = 8000;
const app = express();

// .env 실행
dotenv.config();

// bodyparser
app.use(bodyParser.json())
// app.use(express.json())

// CORS
// app.use() 미들웨어로더,
// 어떤 요청이든 지정된 로직보다 먼저 작업한다. 즉 전처리이다.
// yarn add cors
app.use(express.urlencoded({extended : false}));
app.use(cors({
    origin : "*",
    method : ["GET", "POST", "DELETE", "PUT"],
    credential : true,
}))

// passport 로직 추가
app.use(passport.initialize());
initializePassport()

// 라우팅 처리
app.use("/", rootRouter)

// 서버 실행
app.listen(port, ()=>{
    console.log(`server is on ${port} port!`)
})