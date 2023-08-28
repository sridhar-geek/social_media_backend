import express from 'express'
const router = express.Router()

        /* Import modules from other files */
import { register, login } from '../Controllers/userAuth.js'


router.route('/register').post(register)
router.route('/login').post(login)


export default router;