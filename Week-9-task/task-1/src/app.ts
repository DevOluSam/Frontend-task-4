import createError from 'http-errors';
import express, {Request, Response, NextFunction} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import dotenv from "dotenv";
dotenv.config();

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import notesRouter from './routes/notes';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const DB = process.env.DATABASE_URI as string;
mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
}).catch((err) => {
  console.log(err);
  console.log('DB connection failed!');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../', 'public')));

app.use(
  session({
    secret: `${process.env.secret}` , 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
);

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, must-revalidate');
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/notes', notesRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on: http://localhost:${port}`));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
