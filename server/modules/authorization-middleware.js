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

module.exports = { onlyAllowStudent, onlyAllowTeacher };
