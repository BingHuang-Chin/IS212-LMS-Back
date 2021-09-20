alter table "public"."grade"
  add constraint "grade_quiz_id_fkey"
  foreign key ("quiz_id")
  references "public"."quiz"
  ("id") on update cascade on delete cascade;
