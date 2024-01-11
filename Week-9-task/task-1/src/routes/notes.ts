import express from 'express';
import { createNote, updateNote, getNoteById, deleteNote } from '../Controller/NoteController';

const router = express.Router();
router.post('/create', createNote)
router.get('/get/:id', getNoteById)
router.put('/update/:id', updateNote)
router.delete('/delete/:id', deleteNote)



export default router;