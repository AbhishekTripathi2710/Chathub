import express from 'express';
import { userLogin, userRegister } from '../routControllers/userrouteControler.js';
import isLogin from '../middleware/isLogin.js';
import { getUserBySearch, getCurrentChatters } from '../routControllers/userHandlerController.js';

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.get('/search', isLogin, getUserBySearch);
router.get('/currentchatters', isLogin, getCurrentChatters);


export default router;
