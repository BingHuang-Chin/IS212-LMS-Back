alter table "public"."completed_course" drop constraint "completed_course_badge_id_fkey",
  add constraint "completed_course_badge_id_fkey"
  foreign key ("badge_id")
  references "public"."badge"
  ("id") on update cascade on delete cascade;
