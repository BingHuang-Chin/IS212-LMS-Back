BEGIN TRANSACTION;
ALTER TABLE "public"."class" DROP CONSTRAINT "class_pkey";

ALTER TABLE "public"."class"
    ADD CONSTRAINT "class_pkey" PRIMARY KEY ("id");
COMMIT TRANSACTION;
