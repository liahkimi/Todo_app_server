import express from "express";
import { deleteTodo, insertTodo, modifyTodo, selectTodo } from "../controller/todo/todo.js";


const todoRouter = express.Router();

todoRouter.get("/select", selectTodo)
todoRouter.post("/insert", insertTodo)
todoRouter.put("/modify", modifyTodo)
todoRouter.delete("/delete", deleteTodo)




export default todoRouter;