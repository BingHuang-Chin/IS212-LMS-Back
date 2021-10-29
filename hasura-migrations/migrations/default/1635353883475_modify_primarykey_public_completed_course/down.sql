alter table "public"."completed_course" drop constraint "completed_course_pkey";
alter table "public"."completed_course"
    add constraint "completed_course_pkey"
    primary key ("course_id", "learner_id", "badge_id");
