
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
-- CREATE TABLE "user" (
--     "id" SERIAL PRIMARY KEY,
--     "username" VARCHAR (80) UNIQUE NOT NULL,
--     "password" VARCHAR (1000) NOT NULL
-- );

CREATE TABLE "user" (
	"id" serial NOT NULL,
	"username" varchar(120) NOT NULL UNIQUE,
	"first_name" varchar(120) NOT NULL,
	"last_name" varchar(120) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(20) NOT NULL,
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "class" (
	"id" serial NOT NULL,
	"class_name" varchar(127),
	"release_at_once" BOOLEAN NOT NULL DEFAULT true,
	"release_from" TIMESTAMP,
	"release_to" TIMESTAMP,
	"release_order" varchar(20),
	"initial_time" int NOT NULL DEFAULT '30',
	"total_time" int NOT NULL DEFAULT '360',
	"available_to_students" BOOLEAN NOT NULL DEFAULT false,
	"user_id" int NOT NULL,
	"stack_id" int DEFAULT NULL,
	CONSTRAINT "class_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "student_class" (
	"id" serial NOT NULL,
	"user_id" int NOT NULL,
	"class_id" int NOT NULL,
	CONSTRAINT "student_class_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "student_class_session" (
	"id" serial NOT NULL,
	"cards_learned" int NOT NULL,
	"cards_reviewed" int NOT NULL,
	"timestamp" TIMESTAMP NOT NULL DEFAULT NOW(),
	"student_class_id" int NOT NULL,
	CONSTRAINT "student_class_session_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "card" (
	"id" serial NOT NULL,
	"front" varchar(255) NOT NULL,
	"back" varchar(255) NOT NULL,
	"batch" int NOT NULL DEFAULT '1',
	"stack_id" int NOT NULL,
	CONSTRAINT "card_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "stack" (
	"id" serial NOT NULL,
	"stack_name" varchar(127),
	"user_id" int NOT NULL,
	CONSTRAINT "stack_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "student_class_card" (
	"id" serial NOT NULL,
	"familiarity" int NOT NULL DEFAULT 0,
	"time_reviewed" TIMESTAMP NOT NULL DEFAULT NOW(),
	"student_class_id" int NOT NULL,
	"card_id" int NOT NULL,
	CONSTRAINT "student_class_card_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "class" ADD CONSTRAINT "class_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
ALTER TABLE "class" ADD CONSTRAINT "class_fk1" FOREIGN KEY ("stack_id") REFERENCES "stack"("id");

ALTER TABLE "student_class" ADD CONSTRAINT "student_class_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
ALTER TABLE "student_class" ADD CONSTRAINT "student_class_fk1" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE CASCADE;

ALTER TABLE "student_class_session" ADD CONSTRAINT "student_class_session_fk0" FOREIGN KEY ("student_class_id") REFERENCES "student_class"("id") ON DELETE CASCADE;

ALTER TABLE "card" ADD CONSTRAINT "card_fk0" FOREIGN KEY ("stack_id") REFERENCES "stack"("id") ON DELETE CASCADE;

ALTER TABLE "stack" ADD CONSTRAINT "stack_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;

ALTER TABLE "student_class_card" ADD CONSTRAINT "student_class_card_fk0" FOREIGN KEY ("student_class_id") REFERENCES "student_class"("id") ON DELETE CASCADE;
ALTER TABLE "student_class_card" ADD CONSTRAINT "student_class_card_fk1" FOREIGN KEY ("card_id") REFERENCES "card"("id") ON DELETE CASCADE;

-- The above sets up the tables, their foreign keys, and their ON DELETE CASCADEs.
-- Below we feed in some dummy data for each table
-- This data is for testing purposes, hence the unimaginative names :)

INSERT INTO "user" (username, password, first_name, last_name, role)
VALUES ('student1', '$2a$10$nW737QZb2uSev6dJy6Wk8u2VZCgtVxpZa8c.6D/J6Q7jWlz8bgd06', 'student1', 'student1', 'student'),
('student2', '$2a$10$9sSDRXPhbq.ZcTdULB3jB.8k4j2UxT31YCt.f3odHfHA/jM.6j4De', 'student2', 'student2', 'student'),
('student3', '$2a$10$PMwJPYP9GDj5lKXzOfNUSuKMQVnPKL2vH4TeC7KHFLj5tHTxlOyMi', 'student3', 'student3', 'student'),
('teacher1', '$2a$10$U1gdTJCEbf0fUQI83BtL..FZV8v1jT4bVLsNAKWCtxyjfeLWGwyAS', 'teacher1', 'teacher1', 'teacher'),
('teacher2', '$2a$10$aHciqCl3B6re32prqgr2Huo4hvgr8C.mBqfTyRZM7rxzSQ.IHW/Na', 'teacher2', 'teacher2', 'teacher');

INSERT INTO "stack" (stack_name, user_id) 
VALUES ('stack1_belonging_to_teacher1', 4),
('stack2_belonging_to_teacher2', 5);

INSERT INTO "card" (front, back, batch, stack_id)
VALUES ('card1_front', 'card1_back', 1, 1),
('card2_front', 'card2_back', 1, 1),
('card3_front', 'card3_back', 1, 1),
('card4_front', 'card4_back', 1, 1),
('card5_front', 'card5_back', 2, 1),
('card6_front', 'card6_back', 2, 1),
('card7_front', 'card7_back', 2, 1),
('card8_front', 'card8_back', 3, 1),
('card9_front', 'card9_back', 3, 1),
('card10_front', 'card10_back', 3, 1),
('card11_front', 'card11_back', 1, 2),
('card12_front', 'card12_back', 1, 2),
('card13_front', 'card13_back', 1, 2),
('card14_front', 'card14_back', 1, 2),
('card15_front', 'card15_back', 2, 2),
('card16_front', 'card16_back', 2, 2),
('card17_front', 'card17_back', 3, 2),
('card18_front', 'card18_back', 3, 2),
('card19_front', 'card19_back', 3, 2);

INSERT INTO "class" (class_name, user_id, available_to_students, stack_id) 
VALUES ('class1_belonging_to_teacher1', 4, false, NULL),
('class2_belonging_to_teacher1', 4, true, 1),
('class3_belonging_to_teacher2', 5, false, NULL),
('class4_belonging_to_teacher2', 5, true, 2);

INSERT INTO "student_class" (user_id, class_id) 
VALUES (1, 2), -- class2_belonging_to_teacher1
(1, 4), -- class4_belonging_to_teacher2
(2, 2), -- class2_belonging_to_teacher1
(3, 4); -- class4_belonging_to_teacher2

INSERT INTO "student_class_session" (cards_learned, cards_reviewed, student_class_id)
VALUES (2, 3, 1),
(3, 6, 2),
(8, 1, 3);

-- cards with default dates, created with default now()
INSERT INTO "student_class_card" (familiarity, student_class_id, card_id)
VALUES (0, 1, 1), -- card1 in class2 with teacher 1
(0, 1, 2), -- card2 in class2 with teacher 1 for student 1
(0, 1, 3), -- card3 in class2 with teacher 1 for student 1
(0, 1, 4), -- card4 in class2 with teacher 1 for student 1
(1, 1, 5), -- card5 in class2 with teacher 1 for student 1
(1, 1, 6), -- card6 in class2 with teacher 1 for student 1
(2, 1, 8),
(0, 2, 11), -- card11 in class4 with teacher 2 for student 1
(0, 2, 12),
(2, 2, 13),
(2, 2, 14),
(1, 3, 5), -- card5 in class2 with teacher 1 for student 2
(1, 3, 6),
(1, 3, 7),
(1, 3, 8),
(0, 3, 9),
(0, 4, 12), -- card12 in class4 with teacher 2 for student 3
(0, 4, 13),
(1, 4, 14);

-- some cards with older dates, so they should be reviewed
INSERT INTO "student_class_card" (familiarity, student_class_id, card_id, time_reviewed)
VALUES (1, 1, 7, '11-01-2021'),
(2, 1, 9, '11-01-2021'),
(2, 4, 9, '11-01-2021'),
(1, 4, 15, '11-01-2021'),
(1, 4, 16, '11-01-2021'),
(2, 4, 17, '11-01-2021'),
(2, 1, 9, '11-01-2021'),
(3, 1, 10, '11-01-2021');

-- WARNING!!!
-- THIS SQL BELOW WILL DROP ALL THE TABLES! 
-- ONLY DO THIS IF YOU WANT ALL THE DATA TO BE ERASED 
-- AND YOU'RE ABSOLUTELY SURE THAT'S WHAT YOU WANT

-- AGAIN, THE SQL BELOW WILL DELETE ALL THE DATA!

-- ALTER TABLE "class" DROP CONSTRAINT IF EXISTS "class_fk0";

-- ALTER TABLE "class" DROP CONSTRAINT IF EXISTS "class_fk1";

-- ALTER TABLE "student_class" DROP CONSTRAINT IF EXISTS "student_class_fk0";

-- ALTER TABLE "student_class" DROP CONSTRAINT IF EXISTS "student_class_fk1";

-- ALTER TABLE "student_class_session" DROP CONSTRAINT IF EXISTS "student_class_session_fk0";

-- ALTER TABLE "card" DROP CONSTRAINT IF EXISTS "card_fk0";

-- ALTER TABLE "stack" DROP CONSTRAINT IF EXISTS "stack_fk0";

-- ALTER TABLE "student_class_card" DROP CONSTRAINT IF EXISTS "student_class_card_fk0";

-- ALTER TABLE "student_class_card" DROP CONSTRAINT IF EXISTS "student_class_card_fk1";

-- DROP TABLE "card";
-- DROP TABLE "class";
-- DROP TABLE "stack";
-- DROP TABLE "student_class";
-- DROP TABLE "student_class_card";
-- DROP TABLE "student_class_session";
-- DROP TABLE "user";
