alter table "public"."completed_course"
  add constraint "completed_course_learner_id_fkey2"
  foreign key ("learner_id")
  references "public"."learner"
  ("id") on update cascade on delete cascade;
