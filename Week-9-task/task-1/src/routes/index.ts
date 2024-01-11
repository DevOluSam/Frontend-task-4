import express from 'express';
import Note from '../Models/NoteModel';
import { authenticateTokenForNotes } from '../Middleware/auth';
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
    res.render('index')
});

router.get('/users/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/users/login', function(req, res, next) {
  res.render('login');
});

router.get('/users/dashboard', authenticateTokenForNotes, async (req, res) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.redirect('/users/login');
  }

  const perPage = 5;
  let page = Number(req.query.page) || 1;
  page = Math.max(page, 1); 

  const fullName = (req.session as any).fullName;

  const skipValue = Math.max(Number(perPage) * (page - 1), 0);

  const userNotes = await Note.find({ userId })
    .skip(skipValue)
    .limit(Number(perPage))
    .exec();

  const count = await Note.countDocuments({ userId });

  res.render('dashboard', {
    fullName,
    userNotes,
    current: page,
    pages: Math.ceil(count / Number(perPage)),
  });
});




router.get("/users/allNotes", async (req, res, next) => {
  const perPage = 5;
  let page = Number(req.query.page) || 1;
  page = Math.max(page, 1); 
  const skipValue = Math.max(Number(perPage) * (page - 1), 0);

  try {
    const publicNotes = await Note.find()
    .skip(skipValue)
    .limit(Number(perPage))
    .exec();

    const count = await Note.countDocuments();

    res.render('notesPage', {
      publicNotes,
      current: Number(page),
      pages: Math.ceil(count / Number(perPage)),
    });
  } catch (error) {
    console.log(error);
    next(error); 
  }
});

router.get('/users/logout', async(req, res, next) => {
  (req.session as any).destroy((err: any) => {
    if (err) {
      return next(err);
    }
    res.redirect('/users/login');
  });
});

export default router;

