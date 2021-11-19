const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const { onlyAllowStudent } = require('../modules/authorization-middleware');

// GET /api/student/cards/:class_id
// returns all the cards in a specific class that the logged in student
// needs to review
router.get(
  '/cards/:class_id',
  rejectUnauthenticated,
  onlyAllowStudent,
  (req, res) => {
    // build the sql query
    const query = `
      SELECT "card".id, "card".front, "card".back, "card".batch, "card".stack_id, "student_class_card".familiarity, "student_class_card".time_reviewed, "student_class_card".id as "student_class_card_id", "student_class_card".student_class_id FROM "student_class_card"
      JOIN "card" ON "card".id = "student_class_card".card_id
      JOIN "student_class" ON "student_class".id = "student_class_card".student_class_id
      WHERE "student_class".user_id = $1 AND "student_class".class_id = $2;
    `;
    // run the query
    pool
      .query(query, [req.user.id, req.params.class_id])
      .then((response) => {
        // filter out the cards - only those that should be reviewed should be returned
        const cards = response.rows.filter((card) => needsReview(card));
        res.send(cards); // send back the cards
      })
      .catch((err) => {
        console.log(
          `There was an error retrieving the cards to review from the server:`,
          err
        );
        res.sendStatus(500);
      });
  }
);

// GET /api/student/total/cards/:class_id
// fetches the number of cards in total for a student in a specific clss
router.get(
  '/total/cards/:class_id',
  rejectUnauthenticated,
  onlyAllowStudent,
  (req, res) => {
    // build the sql query
    const query = `
    SELECT COUNT(*) FROM "student_class_card"
    JOIN "student_class" ON "student_class".id = "student_class_card".student_class_id
    WHERE "student_class".user_id = $1 AND "student_class".class_id = $2;
  `;

    // run the query
    pool
      .query(query, [req.user.id, req.params.class_id])
      .then((response) => {
        // there is only one number, living on the key of count
        res.send(response.rows[0].count); // send back the total number of cards
      })
      .catch((err) => {
        console.log(
          `There was an error retrieving the total number of cards for a student in a specific classes from the server:`,
          err
        );
        res.sendStatus(500);
      });
  }
);

// GET /api/student/classes/available
// fetches all the available classes
router.get(
  '/classes/available',
  rejectUnauthenticated,
  onlyAllowStudent,
  (req, res) => {
    // build the sql query
    const query = `
      SELECT * FROM "class"
      WHERE "available_to_students" = true;
    `;

    // run the query
    pool
      .query(query)
      .then((response) => {
        res.send(response.rows); // send back the cards
      })
      .catch((err) => {
        console.log(
          `There was an error retrieving the available classes from the server:`,
          err
        );
        res.sendStatus(500);
      });
  }
);

// GET /api/student/classes/enrolled
// fetches all the classes that the student is enrolled in
// as well as their overdue cards
router.get(
  '/classes/enrolled',
  rejectUnauthenticated,
  onlyAllowStudent,
  (req, res) => {
    // build the sql query
    const query = `
      SELECT "student_class".id, "student_class".user_id, "student_class".class_id, "class".class_name FROM "student_class"
      JOIN "class" ON "class".id = "student_class"."class_id"
      WHERE "student_class".user_id = $1;
    `;

    // run the query
    pool
      .query(query, [req.user.id])
      .then((response) => {
        res.send(response.rows); // send back the cards
      })
      .catch((err) => {
        console.log(
          `There was an error retrieving the enrolled classes for the student from the server:`,
          err
        );
        res.sendStatus(500);
      });
  }
);

// PUT /api/student/cards/:student_class_card_id
// this endpoint upgrades the familiarity of a specific card
// for a specific student in a specific class by 1 point.
router.put(
  '/cards/:student_class_card_id',
  rejectUnauthenticated,
  onlyAllowStudent,
  (req, res) => {
    // build the sql query
    // we're updating the familiarity of this card
    console.log(`in PUT, this is req.body`, req.body);
    const query = `
      UPDATE "student_class_card"
      SET "familiarity" = $2, "time_reviewed" = NOW()
      WHERE "id" = $1;
    `;

    // run the sql query
    pool
      .query(query, [req.params.student_class_card_id, req.body.familiarity])
      .then((response) => {
        res.sendStatus(204); // show that it's updated
      })
      .catch((err) => {
        console.log(
          `There was an error updating the card familiarity for this student on the server:`,
          err
        );
        res.sendStatus(500);
      });
  }
);

// enrolls a student in a class in student_class table
// POST /api/student/addclass/:class_id
router.post(
  `/addclass/:class_id`,
  rejectUnauthenticated,
  onlyAllowStudent,
  (req, res) => {
    // build the query
    const query = `
      INSERT INTO "student_class" ("user_id", "class_id")
      VALUES ($1, $2)
      RETURNING "id";
    `;

    // run the query
    pool
      .query(query, [req.user.id, req.params.class_id])
      .then((response) => {
        // we have the id returned in the first row as id
        const student_class_id = response.rows[0].id;
        console.log(`this is student_class_id`, student_class_id);

        // now retrieve cards for this class
        // so we can add it for this specific student in this specific class
        // build an SQL query that grabs all the card ids in this class
        const fetchCardsQuery = `
          SELECT "card".id AS "card_id" FROM "class"
          JOIN "stack" ON "class".stack_id = "stack".id
          JOIN "card" ON "card".stack_id = "stack".id
          WHERE "class".id = $1; 
        `;

        // run the query
        pool
          .query(fetchCardsQuery, [req.params.class_id])
          .then((response) => {
            // we have the ids of the cards for this class
            const cardIds = response.rows;
            console.log('cardIds', cardIds);
            // we don't have to sanitize here, since it's embedded in a response
            // so build a query to insert all the cards
            let addCardsQuery = `
              INSERT INTO "student_class_card" ("card_id", "student_class_id")
              VALUES
            `;
            // add the card ids one by one with a comma
            // the last id will have a semicolon
            for (let i = 0; i < cardIds.length - 1; i++) {
              addCardsQuery += `(${cardIds[i].card_id}, ${student_class_id}), `;
            }
            // now add the final row
            addCardsQuery += `(${
              cardIds[cardIds.length - 1].card_id
            }, ${student_class_id});`;

            // run the query
            pool
              .query(addCardsQuery)
              .then((response) => {
                res.sendStatus(201); // show that the cards have been added
              })
              .catch((err) => {
                console.log(
                  `There was an error updating the card familiarity for this student on the server:`,
                  err
                );
                res.sendStatus(500);
              });
          })
          .catch((err) => {
            // catch black 2/3 for query 2
            console.log(
              `There was an error retrieving the card ids from the server:`,
              err
            );
            res.sendStatus(500);
          });
      })
      .catch((err) => {
        // catch block 1/3 for query 1
        console.log(
          `There was an error adding the class to the student's list on the server:`,
          err
        );
        res.sendStatus(500);
      });
  }
);

/* UTILITY FUNCTIONS */
const needsReview = (card) => {
  console.log(`in needsReview, card is:`, card);

  // all cards with a familiarity of 0 should be returned -
  // they are new cards or cards that are "not seen"
  // cards with a familiarity of 1 should be returned if they are 1 day old
  // cards with a fam of 2 should be returned if 3 days old
  // fam 3 -> 7 days old
  // fam 4 -> 14 days old
  // fam 5 -> 21 days old
  // fam 6 -> 30 days old
  // fam 7 -> 45 days old
  // fam 8 -> 90 days old
  // fam 9 -> 180 days old
  // the numbers above are the days plugged into the calcOverdueDate function

  switch (card.familiarity) {
    case 0:
      return true;
    case 1:
      return card.time_reviewed < calcOverdueDate(1);
    case 2:
      return card.time_reviewed < calcOverdueDate(3);
    case 3:
      return card.time_reviewed < calcOverdueDate(7);
    case 4:
      return card.time_reviewed < calcOverdueDate(14);
    case 5:
      return card.time_reviewed < calcOverdueDate(21);
    case 6:
      return card.time_reviewed < calcOverdueDate(30);
    case 7:
      return card.time_reviewed < calcOverdueDate(45);
    case 8:
      return card.time_reviewed < calcOverdueDate(90);
    case 9:
      return card.time_reviewed < calcOverdueDate(180);
    default:
      return false;
  }
};

// calculates a date against which the card.time_reviewed can be measured
const calcOverdueDate = (daysUntilOverdue) => {
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - daysUntilOverdue);
  return pastDate;
};

module.exports = router;
