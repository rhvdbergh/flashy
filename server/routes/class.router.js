const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const { onlyAllowTeacher } = require('../modules/authorization-middleware');

// GET /api/class
// fetches all the classes belonging to a logged in teacher
router.get('/', rejectUnauthenticated, onlyAllowTeacher, (req, res) => {
  // build the sql query
  const query = `
    SELECT * FROM "class"
    WHERE "user_id" = $1;
  `;

  // run the query
  pool
    .query(query, [req.user.id])
    .then((response) => {
      console.log('this was the response', response.rows);
      res.send(response.rows);
    })
    .catch((err) => {
      console.log(
        `There was an error retrieving the class list from the server:`,
        err
      );
      res.sendStatus(500);
    });
});

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;
