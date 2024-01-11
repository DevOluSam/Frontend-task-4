import express from 'express';
import { signup, login } from '../Controller/userController';
import { authenticateToken } from '../Middleware/auth';
import { createNote } from '../Controller/NoteController';
const router = express.Router();


router.post('/signup', signup );
router.post('/login', login, authenticateToken );



export default router;
