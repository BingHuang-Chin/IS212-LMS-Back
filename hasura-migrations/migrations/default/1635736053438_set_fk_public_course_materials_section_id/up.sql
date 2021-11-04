alter table "public"."course_materials"
  add constraint "course_materials_section_id_fkey"
  foreign key ("section_id")
  references "public"."section"
  ("id") on update cascade on delete cascade;
