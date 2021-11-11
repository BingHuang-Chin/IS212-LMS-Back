BEGIN TRANSACTION;
ALTER TABLE "public"."selected_options" DROP CONSTRAINT "selected_options_pkey";

ALTER TABLE "public"."selected_options"
    ADD CONSTRAINT "selected_options_pkey" PRIMARY KEY ("attempt", "quiz_id", "learner_id", "question_id");
COMMIT TRANSACTION;
