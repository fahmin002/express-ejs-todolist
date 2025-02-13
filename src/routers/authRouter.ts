/* authRouter.ts - Router for authentication routes */
import express from 'express'
import {getLogin, getRegister, logout, postLogin, postRegister, guestOnly, authOnly} from '../handlers/authHandler'
const router = express.Router()

router.get('/login', guestOnly, getLogin)
router.post('/login', guestOnly, postLogin)
router.get('/register', guestOnly, getRegister)
router.post('/register',guestOnly, postRegister)
router.get('/logout', authOnly, logout)
export default router
/* end of authRouter.ts */