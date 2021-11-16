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
    WHERE "user_id" = $1
    ORDER BY "id";
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
    // if this stack is assigned to any classes, we should set their assigned
    // stacks to null
    const query = `
      UPDATE "class"
      SET "stack_id" = NULL 
      WHERE "stack_id" = $1;
    `;

    // remove the stack from user lists
    pool
      .query(query, [req.params.stack_id])
      .then((response) => {
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
            // error block for second pool query
            console.log(
              `There was an error deleting the stack from the server:`,
              err
            );
            res.sendStatus(500);
          });
      })
      .catch((err) => {
        // error block for first pool query
        console.log(
          `There was an error deleting the stack from the server:`,
          err
        );
      });
  }
);

// post
router.post('/', rejectUnauthenticated, onlyAllowTeacher, (req, res) => {
  // POST route code here
  console.log(`POST /api/stack`);
  // build the SQL query
  // the query is empty except for the user_id because the stack
  // has not been named yet, this will happen with a PUT
  const query = `
    INSERT INTO "stack" (user_id) 
    VALUES ($1)
    RETURNING "id";
  `;
  // run the SQL query
  pool
    .query(query, [req.user.id])
    .then((response) => {
      // response.rows[0] contains an object {id: ?}
      // with the newly created stack
      const newStackId = response.rows[0].id;

      // build a new query to update the name of this stack,
      // which will be generic and based on the id so it is unique
      const updateQuery = `
        UPDATE "stack"
        SET "stack_name" = 'New Card Stack ${newStackId}'
        WHERE "id" = ${newStackId};
      `;
      pool
        .query(updateQuery)
        .then((updateResponse) => {
          // send the status that the stack was created, returning the new id
          res.status(201).send({ id: newStackId }); // the stack was created
        })
        .catch((err) => {
          // catch block for updateQuery pool
          console.log(
            `There was an error creating a new stack on the server:`,
            err
          );
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      // catch block for the Insert Into query
      console.log(
        `There was an error creating a new stack on the server:`,
        err
      );
      res.sendStatus(500);
    });
});

// updates a specific stack
// /api/stack/:stack_id
router.put(
  '/:stack_id',
  rejectUnauthenticated,
  onlyAllowTeacher,
  (req, res) => {
    // build the sql query
    const query = `
      UPDATE "stack"
      SET "stack_name" = $3
      WHERE "id" = $1 AND "user_id" = $2;
    `;

    // run the sql query
    pool
      .query(query, [req.params.stack_id, req.user.id, req.body.stack_name])
      .then((response) => {
        res.sendStatus(200); // the stack was updated
      })
      .catch((err) => {
        console.log(
          `There was an error updating the stack on the server:`,
          err
        );
        res.sendStatus(500);
      });
  }
);

// gets the stack (it's name) and all associated cards
router.get(
  '/:stack_id',
  rejectUnauthenticated,
  onlyAllowTeacher,
  (req, res) => {
    // build the SQL query
    const query = `
      SELECT * FROM "stack"
      WHERE id = $1;
    `;

    pool
      .query(query, [req.params.stack_id])
      .then((response) => {
        res.send(response.rows[0]); // send back the stack and the cards
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

// gets all the cards belonging to a specific stack
// /api/stack/cards/:stack_id
router.get(
  '/cards/:stack_id',
  rejectUnauthenticated,
  onlyAllowTeacher,
  (req, res) => {
    // build the SQL query
    const query = `
      SELECT * FROM "card"
      WHERE "stack_id" = $1
      ORDER BY "id";
    `;

    // run the sql query
    pool
      .query(query, [req.params.stack_id])
      .then((response) => {
        res.send(response.rows); // send back the stack and the cards
      })
      .catch((err) => {
        console.log(
          `There was an error retrieving the cards from the server:`,
          err
        );
        res.sendStatus(500);
      });
  }
);

// updates a specific card
// /api/stack/card/:card_id
router.put(
  '/card/:card_id',
  rejectUnauthenticated,
  onlyAllowTeacher,
  (req, res) => {
    console.log(`in /api/stack/card/:card_id, req.body =`, req.body);
    // build the sql query
    const query = `
      UPDATE "card"
      SET "front" = $1, "back" = $2, "batch" = $3
      WHERE "id" = $4;
    `;

    // run the sql query
    pool
      .query(query, [
        req.body.front,
        req.body.back,
        req.body.batch,
        req.params.card_id,
      ])
      .then((response) => {
        res.sendStatus(200); // the card was updated
      })
      .catch((err) => {
        console.log(`There was an error updating the card on the server:`, err);
        res.sendStatus(500);
      });
  }
);

module.exports = router;
