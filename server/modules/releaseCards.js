const pool = require('./pool');

module.exports = () => {
  console.log(`hello`);

  // get all the cards that should be updated along with their classes
  // and the students where they should be updated
  // this returns everything
  const cardsQuery = `
    SELECT "card".id AS "card_id", "student_class".id AS "student_class_id" FROM "card"
    JOIN "class" ON "class".stack_id = "card".stack_id
    JOIN "batch_release_date" ON "batch_release_date".class_id = "class".id AND "batch_release_date".batch_num = "card".batch
    JOIN "student_class" ON "student_class".class_id = "class".id
    WHERE "card".stack_id = "class".stack_id AND "batch_release_date".release_date < CURRENT_DATE + 1;
  `;

  // run the query
  pool
    .query(cardsQuery)
    .then((response) => {
      console.log('response is', response.rows);
      const entries = response.rows;
      // for each card identified above, and for each student in
      // student_class, add this card with a familiarity of 0
      // if the card does not already exist
      const insertQuery = `
      INSERT INTO "student_class_card"  (familiarity, student_class_id, card_id)
	    SELECT 0, $1, $2
	    WHERE NOT EXISTS 
      (SELECT "student_class_id", "card_id" FROM "student_class_card" 
      WHERE "student_class_id" = $1 AND "card_id" = $2);
      `;

      // run the query to update the cards
      for (let entry of entries) {
        pool
          .query(insertQuery, [entry.student_class_id, entry.card_id])
          .then((response) => {
            // success!
          })
          .catch((err) => {
            console.log(`Couldn't release this card`, err);
          });
      }
    })
    .catch((err) => {
      console.log(
        `There was an error retrieving the necessary cards to release from the db:`,
        err
      );
    });
};
