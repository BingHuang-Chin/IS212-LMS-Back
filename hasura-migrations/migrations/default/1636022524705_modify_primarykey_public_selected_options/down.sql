alter table "public"."selected_options" drop constraint "selected_options_pkey";
alter table "public"."selected_options"
    add constraint "selected_options_pkey"
    primary key ("attempt", "quiz_id", "learner_id");
