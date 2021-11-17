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
// DELETE /api/class/:class_id
router.delete(
  '/:class_id',
  rejectUnauthenticated,
  onlyAllowTeacher,
  (req, res) => {
    // only the teacher who made this class can delete it
    // so we check if user_id is the same as the logged in teacher
    // build the SQL query
    const query = `
  DELETE FROM "class" CASCADE
  WHERE "id" = $1 AND "user_id" = $2;
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

// POST /api/class
// creates a new class in the db
router.post('/', rejectUnauthenticated, onlyAllowTeacher, (req, res) => {
  console.log(`POST /api/class`);
  // build the SQL query
  // the query is empty except for the user_id because the class
  // has not been named yet, this will happen with a PUT
  const query = `
    INSERT INTO "class" (user_id) 
    VALUES ($1)
    RETURNING "id";
  `;
  // run the SQL query
  pool
    .query(query, [req.user.id])
    .then((response) => {
      // response.rows[0] contains an object {id: ?}
      // with the newly created class
      const newClassId = response.rows[0].id;

      // build a new query to update the name of this class,
      // which will be generic and based on the id so it is unique
      const updateQuery = `
        UPDATE "class"
        SET "class_name" = 'New Class ${newClassId}'
        WHERE "id" = ${newClassId};
      `;
      pool
        .query(updateQuery)
        .then((updateResponse) => {
          // send the status that the class was created, returning the new id
          res.status(201).send({ id: newClassId }); // the class was created
        })
        .catch((err) => {
          // catch block for updateQuery pool
          console.log(
            `There was an error creating a new class on the server:`,
            err
          );
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      // catch block for the Insert Into query
      console.log(
        `There was an error creating a new class on the server:`,
        err
      );
      res.sendStatus(500);
    });
});

// fetches a specific class from the server
router.get(
  '/:class_id',
  rejectUnauthenticated,
  onlyAllowTeacher,
  (req, res) => {
    // build the SQL query
    const query = `
      SELECT * FROM "class"
      WHERE id = $1;
    `;

    pool
      .query(query, [req.params.class_id])
      .then((response) => {
        res.send(response.rows[0]); // send back the class
      })
      .catch((err) => {
        console.log(
          `There was an error retrieving the stack from the server:`,
          err
        );
        res.sendStatus(500);
      });
  }
);

// updates a specific class
// /api/class/:class_id
router.put(
  '/:class_id',
  rejectUnauthenticated,
  onlyAllowTeacher,
  (req, res) => {
    console.log(`in /api/class/:class_id, req.body=`, req.body);
    // build the sql query
    const query = `
      UPDATE "class"
      SET "class_name" = $3
      WHERE "id" = $1 AND "user_id" = $2;
    `;

    // run the sql query
    pool
      .query(query, [req.params.class_id, req.user.id, req.body.class_name])
      .then((response) => {
        res.sendStatus(200); // the class was updated
      })
      .catch((err) => {
        console.log(
          `There was an error updating the class on the server:`,
          err
        );
        res.sendStatus(500);
      });
  }
);

module.exports = router;
