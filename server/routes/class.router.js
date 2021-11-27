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
  // this query also returns the number of students in each class
  // we'er doing a left join because regardless of whether there are students we want
  // all the classes
  const query = `
    SELECT "class".class_name, "class".id, "class".user_id, "class".available_to_students, "class".initial_time, "class".release_at_once, "class".release_from, "class".release_order, "class".release_to, "class".total_time, "class".stack_id, COUNT("student_class".user_id) AS "num_students" FROM "class"
LEFT JOIN "student_class" ON "student_class".class_id = "class".id
    WHERE "class".user_id = $1
    GROUP BY "class".class_name, "class".id, "class".user_id, "class".available_to_students, "class".initial_time, "class".release_at_once, "class".release_from, "class".release_order, "class".release_to, "class".total_time, "class".stack_id;
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
router.get('/:class_id', rejectUnauthenticated, (req, res) => {
  // build the SQL query
  // we're also returning the number of batches in this stack, so we'll
  // have to fetch the cards, check the batches, and send this back
  // as a Set.size
  const query = `
      SELECT "class".class_name, "class".id, "class".user_id, "class".available_to_students, 
      "class".initial_time, "class".release_at_once, "class".release_from, "class".release_order, 
      "class".release_to, "class".total_time, "class".stack_id, 
      ARRAY_AGG("card".batch) AS "num_batches_in_stack" FROM "class"
      LEFT JOIN "stack" ON "stack".id = "class".stack_id
      LEFT JOIN "card" ON "card".stack_id = "stack".id
      WHERE "class".id = $1
      GROUP BY "class".class_name, "class".id, "class".user_id, "class".available_to_students, 
      "class".initial_time, "class".release_at_once, "class".release_from, "class".release_order, 
      "class".release_to, "class".total_time, "class".stack_id;
    `;

  pool
    .query(query, [req.params.class_id])
    .then((response) => {
      const cl = response.rows[0];
      // find all the unique numbers of batches in this stack
      const tempSet = new Set(cl.num_batches_in_stack);
      cl.batches_in_stack = [...tempSet];
      // count the number of batches in the stack
      cl.num_batches_in_stack = tempSet.size;
      res.send(cl); // send back the class
    })
    .catch((err) => {
      console.log(
        `There was an error retrieving the stack from the server:`,
        err
      );
      res.sendStatus(500);
    });
});

// updates a specific class
// /api/class/:class_id
router.put(
  '/:class_id',
  rejectUnauthenticated,
  onlyAllowTeacher,
  (req, res) => {
    // build the sql query
    const query = `
      UPDATE "class"
      SET "class_name" = $3, "stack_id" = $4, 
      "available_to_students" = $5, "total_time" = $6, 
      "initial_time" = $7, release_at_once = $8
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
        req.body.total_time,
        req.body.initial_time,
        req.body.release_at_once,
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
      SELECT "user".first_name, "user".last_name, "user".id AS "student_id", "student_class".id AS "student_class_id", ARRAY_AGG("student_class_card".familiarity) AS "familiarity", ARRAY_AGG("student_class_session".id) AS "sessions" FROM "student_class"
      JOIN "user" ON "user".id = "student_class".user_id
      JOIN "student_class_card" ON "student_class".id = "student_class_card".student_class_id
      JOIN "student_class_session" ON "student_class_session".student_class_id = "student_class".id
      WHERE "student_class".class_id = $1
      GROUP BY "user".first_name, "user".last_name, "user".id, "student_class".id;
    `;

    // run the query
    pool
      .query(query, [req.params.class_id])
      .then((response) => {
        // TODO: calc the totals for everyone
        // we're receiving back an object with an embedded array with the
        // familiarities of cards in an object as "familiarity"
        // and an array of all the cards's sessions, which needs to be calculated
        console.log(`this is the response.rows`, response.rows);
        const list = response.rows.map((student) => {
          return {
            first_name: student.first_name,
            last_name: student.last_name,
            // we're filtering for 0's and more than 0's because that shows learned and unlearned
            learned_cards:
              student.familiarity.filter((fam) => fam > 0).length /
              new Set(student.sessions).size,
            not_learned_cards:
              student.familiarity.filter((fam) => fam === 0).length /
              new Set(student.sessions).size,
            // there are several duplicates of the sessions, so we need to
            // make a set and then gets it's size to do the count
            completed_sessions: new Set(student.sessions).size,
            student_id: student.student_id,
            student_class_id: student.student_class_id,
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

// creates entirely new batch release dates for a class
// POST /api/class/batch_release/:class_id
router.post(
  '/batch_release/:class_id',
  rejectUnauthenticated,
  onlyAllowTeacher,
  (req, res) => {
    // build the sql query
    let query = `INSERT INTO "batch_release_date" ("class_id", "batch_num")
    VALUES
    `;

    const values = [req.params.class_id];
    // we start from 2 because the parameter $1 will be the class_id
    let counter = 2;
    // build the string except for the last item, which requires a semicolon
    for (let i = 0; i < req.body.length - 1; i++) {
      query += `($1, $${counter}),`;
      values.push(req.body[i]);
      counter++;
    }

    // now add the last line with a semicolon
    query += `($1, $${counter});`;
    values.push(req.body[req.body.length - 1]);

    // run the query
    pool
      .query(query, [...values])
      .then((response) => {
        res.sendStatus(201); // the batch release dates were created
      })
      .catch((err) => {
        console.log(
          `There was an error creating the batch release dates on the server:`,
          err
        );
        res.sendStatus(500);
      });
  }
);

// fetches the release batch dates for a specific class from the db
// GET /api/class/batch_release/:class_id
router.get(
  '/batch_release/:class_id',
  rejectUnauthenticated,
  onlyAllowTeacher,
  (req, res) => {
    // build the sql query
    const query = `
  SELECT * FROM "batch_release_date"
  WHERE "class_id" = $1;
  `;

    // run the query
    pool
      .query(query, [req.params.class_id])
      .then((response) => {
        res.send(response.rows);
      })
      .catch((err) => {
        console.log(
          `There was an error fetching the batch release dates from the server:`,
          err
        );
        res.sendStatus(500);
      });
  }
);

// deletes all the batch release dates for a specific class from the batch_release_date table
// /api/class/batch_release/:class_id
router.delete(
  '/batch_release/:class_id',
  rejectUnauthenticated,
  onlyAllowTeacher,
  (req, res) => {
    // build the query
    const query = `
    DELETE FROM "batch_release_date"
    WHERE "class_id" = $1;
  `;

    // run the query
    pool
      .query(query, [req.params.class_id])
      .then((response) => {
        res.sendStatus(204); // signal that the batch release dates were deleted
      })
      .catch((err) => {
        console.log(
          `There was an error deleting the batch release dates from the server:`,
          err
        );
        res.sendStatus(500);
      });
  }
);

module.exports = router;
