alter table "public"."enrolment" alter column "name" drop not null;
alter table "public"."enrolment" add column "name" text;
