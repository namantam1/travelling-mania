const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//1) Global MIDDLE WEAR
// console.log(process.env.NODE_ENV);
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }
console.log(process.env.NODE_ENV);
/////////////////////////////

//////////////////////////////

//serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));
//set security http headers
// app.use(helmet());
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       useDefaults: true,
//       directives: {
//         'script-src': ["'self'", 'https://cdnjs.cloudflare.com/'],
//       },
//     },
//   })
// );
//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP,please try again in an hour!',
});
app.use('/api', limiter);

//body parser,reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //middle wear
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//data sanitization againt NoSQL query injection

app.use(mongoSanitize());

//Data sanitization against XSS(cross-site scripting)
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//our middle wear
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint..');
// });

// 2) ROUTE HANDERS

/////

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// // app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3)ROUTERS
app.use('/', viewRouter);
//mounting of routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// 4) START THE SERVER

module.exports = app;
