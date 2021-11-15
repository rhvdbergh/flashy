const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const { onlyAllowTeacher } = require('../modules/authorization-middleware');
const { response } = require('express');

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
      // send the rows, which contain the sql rows fetched by the query
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

// delete a specific class for a logged in teacher
router.delete(
  '/:class_id',
  rejectUnauthenticated,
  onlyAllowTeacher,
  (req, res) => {
    // only the teacher who made this class can delete it
    // so we check if user_id is the same as the logged in teacher
    // build the SQL query
    const query = `
  DELETE FROM "class"
  WHERE "id" = $1 AND "user_id" = $2
  RETURNING "user_id" = $2;
  `;

    // run the SQL query
    pool
      .query(query, [req.params.class_id, req.user.id])
      .then((response) => {
        res.sendStatus(204); // the delete was successful
      })
      .catch((err) => {
        console.log(
          `There was an error deleting the class from the server:`,
          err
        );
        res.sendStatus(500);
      });
  }
);

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;
