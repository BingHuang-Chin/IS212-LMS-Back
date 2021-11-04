alter table "public"."class" drop constraint "class_pkey";
alter table "public"."class"
    add constraint "class_pkey"
    primary key ("id");
