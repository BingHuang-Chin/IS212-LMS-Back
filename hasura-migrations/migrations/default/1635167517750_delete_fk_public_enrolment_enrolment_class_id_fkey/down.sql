alter table "public"."enrolment"
  add constraint "enrolment_class_id_fkey"
  foreign key ("class_id")
  references "public"."class"
  ("id") on update cascade on delete cascade;
