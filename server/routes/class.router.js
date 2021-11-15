const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
  onlyAllowTeacher,
} = require('../modules/authentication-middleware');

// GET /api/class
// fetches all the classes belonging to a logged in teacher
router.get('/', rejectUnauthenticated, onlyAllowTeacher, (req, res) => {
  console.log(`this is the user`, req.user);
  // GET route code here
  res.sendStatus(200);
});

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;
