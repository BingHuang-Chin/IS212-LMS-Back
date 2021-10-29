alter table "public"."completed_course"
  add constraint "completed_course_course_id_fkey"
  foreign key ("course_id")
  references "public"."course"
  ("id") on update cascade on delete cascade;
