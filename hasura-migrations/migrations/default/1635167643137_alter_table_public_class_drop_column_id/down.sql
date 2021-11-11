alter table "public"."class" alter column "id" drop not null;
alter table "public"."class" add column "id" int4;
