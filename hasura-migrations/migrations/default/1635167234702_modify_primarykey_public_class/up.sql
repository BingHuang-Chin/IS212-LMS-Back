BEGIN TRANSACTION;
ALTER TABLE "public"."class" DROP CONSTRAINT "class_pkey";

ALTER TABLE "public"."class"
    ADD CONSTRAINT "class_pkey" PRIMARY KEY ("trainer_id", "course_id", "id");
COMMIT TRANSACTION;
