CREATE TABLE "public"."grade" ("id" serial NOT NULL, "completed_date" timestamptz NOT NULL DEFAULT now(), "score" integer NOT NULL, PRIMARY KEY ("id") );
