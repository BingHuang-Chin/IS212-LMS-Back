alter table "public"."class" alter column "start_date" drop not null;
alter table "public"."class" add column "start_date" timetz;
