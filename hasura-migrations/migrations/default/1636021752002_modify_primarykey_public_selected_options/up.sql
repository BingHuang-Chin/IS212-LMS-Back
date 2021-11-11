alter table "public"."selected_options"
    add constraint "selected_options_pkey"
    primary key ("option_id", "quiz_id", "learner_id", "attempt");
