const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cron = require('node-cron');
// module to handle releases of cards according to batches
const releaseCards = require('./modules/releaseCards.js');

const app = express();

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const classRouter = require('./routes/class.router');
const stackRouter = require('./routes/stack.router');
const studentRouter = require('./routes/student.router');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/class', classRouter);
app.use('/api/stack', stackRouter);
app.use('/api/student', studentRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

// run node-cron every day at 2am to release batches of cards to classes if necessary
const update = cron.schedule('* 2 * * *', releaseCards);
