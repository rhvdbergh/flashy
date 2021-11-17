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
        res.send(response.rows); // send back the cards
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
module.exports = router;
