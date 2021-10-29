comment on column "public"."completed_course"."course_completion_date" is E'store history of completed courses';
alter table "public"."completed_course" alter column "course_completion_date" drop not null;
alter table "public"."completed_course" add column "course_completion_date" time;
