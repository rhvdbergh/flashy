-- WARNING!!!
-- THIS SQL BELOW WILL DROP ALL THE TABLES! 
-- ONLY DO THIS IF YOU WANT ALL THE DATA TO BE ERASED 
-- AND YOU'RE ABSOLUTELY SURE THAT'S WHAT YOU WANT

-- AGAIN, THE SQL BELOW WILL DELETE ALL THE DATA!

ALTER TABLE "class" DROP CONSTRAINT IF EXISTS "class_fk0";

ALTER TABLE "class" DROP CONSTRAINT IF EXISTS "class_fk1";

ALTER TABLE "student_class" DROP CONSTRAINT IF EXISTS "student_class_fk0";

ALTER TABLE "student_class" DROP CONSTRAINT IF EXISTS "student_class_fk1";

ALTER TABLE "student_class_session" DROP CONSTRAINT IF EXISTS "student_class_session_fk0";

ALTER TABLE "card" DROP CONSTRAINT IF EXISTS "card_fk0";

ALTER TABLE "stack" DROP CONSTRAINT IF EXISTS "stack_fk0";

ALTER TABLE "student_class_card" DROP CONSTRAINT IF EXISTS "student_class_card_fk0";

ALTER TABLE "student_class_card" DROP CONSTRAINT IF EXISTS "student_class_card_fk1";

ALTER TABLE "batch_release_date" DROP CONSTRAINT IF EXISTS "batch_release_date_fk0";

DROP TABLE "card";
DROP TABLE "class";
DROP TABLE "stack";
DROP TABLE "student_class";
DROP TABLE "student_class_card";
DROP TABLE "student_class_session";
DROP TABLE "user";
DROP TABLE "batch_release_date"