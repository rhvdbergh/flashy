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
    WHERE "user_id" = $1
    ORDER BY "class_name";
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
      SET "class_name" = $3, "stack_id" = $4, "available_to_students" = $5
      WHERE "id" = $1 AND "user_id" = $2;
    `;

    // run the sql query
    pool
      .query(query, [
        req.params.class_id,
        req.user.id,
        req.body.class_name,
        req.body.stack_id,
        req.body.available_to_students,
      ])
      .then((response) => {
        res.sendStatus(201); // the class was updated
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

// fetches the progress details for a specific class from the server
// GET /api/class/progress/:class_id
router.get(
  '/progress/:class_id',
  rejectUnauthenticated,
  onlyAllowTeacher,
  (req, res) => {
    // build the sql query
    const query = `
      SELECT "user".first_name, "user".last_name, ARRAY_AGG("student_class_card".familiarity) AS "familiarity", ARRAY_AGG("student_class_session".id) AS "num_sessions" FROM "student_class"
      JOIN "user" ON "user".id = "student_class".user_id
      JOIN "student_class_card" ON "student_class".id = "student_class_card".student_class_id
      JOIN "student_class_session" ON "student_class_session".student_class_id = "student_class".id
      WHERE "student_class".class_id = $1
      GROUP BY "user".first_name, "user".last_name;
    `;

    // run the query
    pool
      .query(query, [req.params.class_id])
      .then((response) => {
        // TODO: calc the totals for everyone
        // we're receiving back an object with an embedded array with the
        // familiarities of cards in an object as "familiarity"
        // and an array of all the cards's sessions, which needs to be calculated
        const list = response.rows.map((student) => {
          return {
            first_name: student.first_name,
            last_name: student.last_name,
            // we're filtering for 0's and more than 0's because that shows learned and unlearned
            learned_cards: student.familiarity.filter((fam) => fam > 0).length,
            not_learned_cards: student.familiarity.filter((fam) => fam === 0)
              .length,
            // there are several duplicates of the sessions, so we need to
            // make a set and then gets it's size to do the count
            completed_sessions: new Set(student.num_sessions).size,
          };
        });
        res.send(list);
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
