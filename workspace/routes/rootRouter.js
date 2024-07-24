import express from "express";
import todoRouter from "./todoRouter.js";
import userRouter from "./userRouter.js";
import { index } from "../controller/index.js";

const rootRouter = express.Router();

//.use()는 어떤 요청보다 먼저 가로채어 실행함
rootRouter.get("/", index)
// todo/select 이런식으로 각 라우터들의 앞부분을 가로채어 구분해줌
rootRouter.use("/todo", todoRouter)
rootRouter.use("/user", userRouter)

export default rootRouter;