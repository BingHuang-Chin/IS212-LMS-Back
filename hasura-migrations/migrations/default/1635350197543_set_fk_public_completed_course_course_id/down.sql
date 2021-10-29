alter table "public"."completed_course" drop constraint "completed_course_course_id_fkey",
  add constraint "completed_course_course_id_fkey"
  foreign key ("learner_id")
  references "public"."learner"
  ("id") on update cascade on delete cascade;
