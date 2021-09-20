alter table "public"."grade"
  add constraint "grade_learner_id_fkey"
  foreign key ("learner_id")
  references "public"."learner"
  ("id") on update cascade on delete cascade;
