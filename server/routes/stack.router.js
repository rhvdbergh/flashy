const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const { onlyAllowTeacher } = require('../modules/authorization-middleware');

// GET /api/stack
// fetches all the stacks belonging to a logged in teacher
router.get('/', rejectUnauthenticated, onlyAllowTeacher, (req, res) => {
  // build the sql query
  const query = `
    SELECT * FROM "stack"
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
        `There was an error retrieving the stack list from the server:`,
        err
      );
      res.sendStatus(500);
    });
});

// delete a specific stack for a logged in teacher
// DELETE /api/stack/:stack_id
router.delete(
  '/:stack_id',
  rejectUnauthenticated,
  onlyAllowTeacher,
  (req, res) => {
    // only the teacher who made this stack can delete it
    // so we check if user_id is the same as the logged in teacher
    // build the SQL query
    const query = `
  DELETE FROM "stack" CASCADE
  WHERE "id" = $1 AND "user_id" = $2;
  `;

    // run the SQL query
    pool
      .query(query, [req.params.stack_id, req.user.id])
      .then((response) => {
        res.sendStatus(204); // the delete was successful
      })
      .catch((err) => {
        console.log(
          `There was an error deleting the stack from the server:`,
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
