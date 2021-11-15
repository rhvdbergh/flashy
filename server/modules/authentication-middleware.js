const rejectUnauthenticated = (req, res, next) => {
  // check if logged in
  if (req.isAuthenticated()) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
    next();
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
};

// only allow this if the user has a role of teacher
const onlyAllowTeacher = (req, res, next) => {
  if (req.user.role === 'teacher') {
    // they're a teacher
    next();
  } else {
    res.sendStatus(403); // tell them it's forbidden!
  }
};

// only allow this if the user has a role of student
const onlyAllowStudent = (req, res, next) => {
  if (req.user.role === 'student') {
    // they're a teacher
    next();
  } else {
    res.sendStatus(403); // tell them it's forbidden!
  }
};

module.exports = { rejectUnauthenticated, onlyAllowTeacher, onlyAllowStudent };
