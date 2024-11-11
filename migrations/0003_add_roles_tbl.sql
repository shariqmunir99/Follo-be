CREATE TABLE IF NOT EXISTS "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"roleName" text NOT NULL,
	CONSTRAINT "roles_roleName_unique" UNIQUE("roleName")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "roleID" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_roleID_roles_id_fk" FOREIGN KEY ("roleID") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
