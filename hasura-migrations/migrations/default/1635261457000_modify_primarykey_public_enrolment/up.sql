BEGIN TRANSACTION;
ALTER TABLE "public"."enrolment" DROP CONSTRAINT "enrolment_pkey";

ALTER TABLE "public"."enrolment"
    ADD CONSTRAINT "enrolment_pkey" PRIMARY KEY ("course_id", "learner_id", "trainer_id");
COMMIT TRANSACTION;
