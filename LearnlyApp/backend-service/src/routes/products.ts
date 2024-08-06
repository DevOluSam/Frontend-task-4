import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();

/* GET home page. */
router.get('/products', function(req: Request, res: Response, next: NextFunction) {
  res.send("GET HOMEPAGE")
});

export default router;
