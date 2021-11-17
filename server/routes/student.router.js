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
    // TODO: we're just sending all the cards at the moment
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
