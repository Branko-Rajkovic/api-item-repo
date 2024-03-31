const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorControler');
const itemRouter = require('./routes/itemRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

//seting pug template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

//set security HTTP headers. Helmet default options
app.use(helmet());

//logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//max number of requestes from one IP in one hour (3600000 miliseconds)
const limiter = rateLimit({
  limit: 1000,
  windowMS: 3600000,
  message: 'To many requests from this IP. Please try again later!',
});
app.use('/api', limiter);

//Body parser, data from body to req.body, more than 10kb will not be accepted
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//Data sanitization agains NoSQL query injection
app.use(mongoSanitize());

//Data sanitization agains XSS
app.use(xss());

//Prevent parametar pollution
app.use(
  hpp({
    whitelist: ['itemValue'],
  })
);

app.use(compression());

//Routes
app.use('/', viewRouter);

app.use('/api/v1/items', itemRouter);

app.use('/api/v1/users', userRouter);

app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Requested page not found : ${req.originalUrl}`), 404);
});

app.use(errorHandler);
module.exports = app;
