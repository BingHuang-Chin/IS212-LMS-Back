BEGIN TRANSACTION;
ALTER TABLE "public"."completed_course" DROP CONSTRAINT "completed_course_pkey";

ALTER TABLE "public"."completed_course"
    ADD CONSTRAINT "completed_course_pkey" PRIMARY KEY ("course_id", "learner_id");
COMMIT TRANSACTION;
