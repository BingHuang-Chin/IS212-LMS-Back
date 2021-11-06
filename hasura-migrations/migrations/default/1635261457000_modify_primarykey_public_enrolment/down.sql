alter table "public"."enrolment" drop constraint "enrolment_pkey";
alter table "public"."enrolment"
    add constraint "enrolment_pkey"
    primary key ("course_id", "learner_id");
