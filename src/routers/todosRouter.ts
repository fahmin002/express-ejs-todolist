/* todoRouter.ts berfungsi untuk menangani routing yang berhubungan dengan todo. */
import express from 'express'
import {addTodo, deleteTodo, displayAddForm, displayAllTodos, updateStatus, updateTodo, editTodo } from '../handlers/todosHandler'
import { authOnly } from '../handlers/authHandler'
const router = express.Router()

router.get('/', authOnly, displayAllTodos)
router.get('/tambah',authOnly, displayAddForm)
router.post('/update-status/:id',authOnly, updateStatus)
router.post('/tambah-todo',authOnly, addTodo)
router.post('/delete-todo/:id',authOnly, deleteTodo)
router.get('/edit-todo/:id',authOnly, editTodo)
router.post('/update-todo/:id',authOnly, updateTodo)

export default router
/* end of todosRouter.ts */