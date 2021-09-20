alter table "public"."prerequisite"
  add constraint "prerequisite_required_course_id_fkey"
  foreign key ("required_course_id")
  references "public"."course"
  ("id") on update cascade on delete cascade;
