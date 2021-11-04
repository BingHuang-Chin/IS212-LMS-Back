alter table "public"."class" alter column "id" set default nextval('class_id_seq'::regclass);
