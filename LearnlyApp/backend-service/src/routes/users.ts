import express, { Request, Response, NextFunction } from 'express';
import { createUser, login } from '../controllers/users';
const router = express.Router();

/* GET users listing. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('GET USERS');
});

router.post('/', createUser)
router.post('/login', login )

export default router;
